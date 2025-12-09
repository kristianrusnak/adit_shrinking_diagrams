import os
import tempfile
import json
from typing import Union

from datetime import datetime
from app.util import logger
from fastapi import (
    FastAPI,
    UploadFile,
    Form,
    File,
    HTTPException,
    Request,
    Depends,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from app.services.openai_service import OpenAIService
from app.services.parse_puml_service import PUMLParser
from app.services.shrinking_algorithms.factory import get_algorithm

from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserListItem, UserRegister, UserResponse, UserLogin, TokenResponse, RefreshRequest
from app.schemas.chat_thread import ChatThreadSchema, ThreadRenameRequest
from app.schemas.chat_message import ChatMessageSchema
from app.schemas.thread_create_response import ThreadCreateResponse

from app.services.security_service import hash_password
from app.services.jwt_service import create_access_token, create_refresh_token, hash_refresh_token, verify_access_token, verify_refresh_token
from app.services.chat_service import ChatService

from app.schemas.config import ConfigRequest, Algorithm
from app.schemas.user import (
    UserListItem,
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse,
    RefreshRequest,
)

from app.services.security_service import hash_password
from app.services.jwt_service import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    verify_access_token,
    verify_refresh_token,
)

app = FastAPI()
logger.log("Starting FastAPI", level="info")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: set to frontend url (security)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/api/logs")
async def log_endpoint(request: Request):
    data = await request.json()
    level = data.get("level", "info")
    message = data.get("message", "")
    extra = data.get("extra", [])
    if extra:
        message += " " + " ".join(map(str, extra))
    logger.log(message, level=level)
    return {"status": "ok"}


# bounce back the file
@app.post("/api/sendMock")
def mock_controller(file: UploadFile):
    # simulate wait 1 seconds
    import time

    time.sleep(1)
    try:
        content_bytes = file.file.read()
        content = content_bytes.decode("utf-8")
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to read PUML file")
    return {"response": content}

@app.post("/api/sendMessage")
def message_controller(file: UploadFile, history: str = Form(None)):

    try:
        content_bytes = file.file.read()
        content = content_bytes.decode("utf-8")
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to read PUML file")

    service = OpenAIService()

    # Parse history
    history_list = json.loads(history) if history else []
    logger.log(f"Received history: {history_list}", level="debug")

    if not history_list or history_list[-1]["role"] != "user":
        raise HTTPException(status_code=400, detail="no request found for processing")

    if content:
        history_list.insert(
            -1,
            {
                "role": "user",
                "content": f"Here is the PlantUML content:\n{content}",
                "timestamp": history_list[-1].get("timestamp"),
            },
        )

    for entry in history_list:
        if not entry.get("content"):
            entry["content"] = entry["text"]

    logger.log(f"Parsed prompt: {history_list}", level="debug")
    response = service.chat(history_list)

    return {"response": response}


@app.post("/api/processPUML")
def process_puml(
    file: UploadFile = File(...), algorithm: str = Form(...), settings: str = Form(...)
):
    logger.log("/api/processPUML", level="info")
    parser = PUMLParser("app/services/parser_config.json")
    source_path = None
    output_path = None

    try:
        algorithm_settings = json.loads(settings)
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to parse settings")

    print(algorithm)
    print(algorithm_settings)

    try:
        content = file.file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".puml") as tmp:
            tmp.write(content)
            source_path = tmp.name

        parsed = parser.parse_file(
            source_path
        )  # TODO: this should be throwing an exception not an empty list
        if not parsed:
            raise HTTPException(status_code=500, detail="Unable to parse PUML file")

        # TODO: unify frontend/backend names too tired
        if algorithm == Algorithm.evolution:
            alg = get_algorithm("genetic")
            alg.initialize(
                population_size=algorithm_settings.get("population", 50),
                generations=algorithm_settings.get("iterations", 100),
            )
        elif algorithm == Algorithm.kruskals:
            alg = get_algorithm("kruskal")
            # TODO: add settigns
        else:
            raise HTTPException(status_code=400, detail="Invalid algorithm")

        reduced = alg.compute(parsed)
        logger.log(f"Reduced PUML: {reduced}", level="debug")

        with tempfile.NamedTemporaryFile(
            delete=False, suffix="_reduced.puml"
        ) as tmp_out:
            output_path = tmp_out.name
        parser.reparse_file(source_path, output_path, reduced)
        with open(output_path, "r") as f:
            result = f.read()

        return {"parsed": parsed, "reduced": reduced, "result_puml": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if source_path and os.path.exists(source_path):
            try:
                os.remove(source_path)
            except:
                pass
        if output_path and os.path.exists(output_path):
            try:
                os.remove(output_path)
            except:
                pass


@app.get("/users", response_model=list[UserListItem])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User).filter(User.email == user_data.email).first()
    )  # pyright: ignore
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )
    user = User(
        email=user_data.email, password_hash=hash_password(user_data.password)
    )  # pyright: ignore
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=TokenResponse, status_code=200)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    user = (
        db.query(User)  # pyright: ignore
        .filter(
            User.email == user_data.email,
            hash_password(user_data.password) == User.password_hash,
        )
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password"
        )

    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token()

    token_entry = RefreshToken(
        user_id=user.id,
        token_hash=hash_password(refresh_token),
        expires_at=RefreshToken.generate_expiration(),
    )
    db.add(token_entry)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = int(payload.get("sub"))
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/threads", response_model=list[ChatThreadSchema])
def threads_controller(user: User = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    chat_service = ChatService(db)

    try:
        return chat_service.retrieve_threads(
            user_id=user.id,
            order="DESC"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/threads/{thread_id}", response_model=list[ChatMessageSchema])
def thread_chat_controller(thread_id: str,
                           user: User = Depends(get_current_user),
                           db: Session = Depends(get_db)):
    chat_service = ChatService(db)

    try:
        return chat_service.retrieve_messages(
            user_id=user.id,
            thread_id=thread_id,
            order="ASC"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/threads/rename", response_model=ChatThreadSchema)
def rename_thread_controller(data: ThreadRenameRequest,
                             user: User = Depends(get_current_user),
                             db: Session = Depends(get_db)):
    chat_service = ChatService(db)

    try:
        return chat_service.rename_thread(
            user_id=user.id,
            thread_id=data.thread_id,
            title=data.new_title,
            commit=True
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/threads/delete/{thread_id}")
def delete_thread_controller(thread_id: str,
                             user: User = Depends(get_current_user),
                             db: Session = Depends(get_db)):
    chat_service = ChatService(db)

    try:
        chat_service.delete_thread(
            user_id=user.id,
            thread_id=thread_id,
            commit=True
        )
        return {"detail": "Thread deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/threads/create")
def create_thread_controller(
    title: str = Form(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_service = ChatService(db)

    try:
        thread = chat_service.create_thread(
            user_id=user.id,
            title=title,
            commit=True
        )
        return thread
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/threads/createThreadAndSendPrompt", response_model=ThreadCreateResponse)
def create_thread_and_send_message_controller(
    file: UploadFile = File(None),
    message: str = Form(None),
    title: str = Form(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_service = ChatService(db)

    file_content: str | None = None
    file_name: str | None = None

    if file is not None:
        try:
            content_bytes = file.file.read()
            file_content = content_bytes.decode("utf-8")
            file_name = file.filename
        except Exception:
            raise HTTPException(status_code=400, detail="Unable to read PUML file")

    try:
        new_thread, response = chat_service.create_new_thread_with_prompt(
            title=title,
            user_id=user.id,
            prompt_message=message,
            prompt_file=file_content,
            prompt_file_name=file_name,
        )
        return ThreadCreateResponse(
            thread=ChatThreadSchema.model_validate(new_thread),
            response=ChatMessageSchema.model_validate(response),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/sendPrompt", response_model=ChatMessageSchema)
def send_message_controller(
    file: UploadFile = File(None),
    message: str = Form(None),
    thread_id: str = Form(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_service = ChatService(db)

    file_content: str | None = None
    file_name: str | None = None

    if file is not None:
        try:
            content_bytes = file.file.read()
            file_content = content_bytes.decode("utf-8")
            file_name = file.filename
        except Exception:
            raise HTTPException(status_code=400, detail="Unable to read PUML file")

    try:
        response = chat_service.prompt_message(
            user_id=user.id,
            thread_id=thread_id,
            prompt_message=message,
            prompt_file=file_content,
            prompt_file_name=file_name,
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return user


@app.post("/auth/refresh")
def refresh_access_token(request: RefreshRequest, db: Session = Depends(get_db)):
    token_hash = hash_refresh_token(request.refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(
        RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,
        )
        .first()
    )

    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid or revoked refresh token")

    # check expiration
    if db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token expired")

    # new access token
    new_access_token = create_access_token(str(db_token.user_id))

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
    }


@app.post("/auth/logout")
def logout(request: RefreshRequest, db: Session = Depends(get_db)):
    token_hash = hash_refresh_token(request.refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,
        )
        .first()
    )

    if not db_token:
        raise HTTPException(status_code=404, detail="Refresh token not found")

    db_token.revoked = True
    db.commit()

    return {"detail": "Logged out successfully"}


@app.post("/api/getAlgConfig")
def get_config_evol(request: ConfigRequest):
    base_path = os.path.dirname(__file__)

    match request.algorithm:
        case Algorithm.kruskals:
            full_path = os.path.join(
                base_path, "services/shrinking_algorithms/kruskals_config.json"
            )
        case Algorithm.evolution:
            full_path = os.path.join(
                base_path, "services/shrinking_algorithms/ga_config.json"
            )
        case _:
            # raise HTTPException(status_code=400, detail="Invalid algorithm")
            return {}

    try:
        with open(full_path, "r") as file:
            config = json.load(file)
            return config

    except Exception as e:
        print(f"Error loading config file: {e}")
        raise HTTPException(status_code=500, detail="Unable to load config file")
