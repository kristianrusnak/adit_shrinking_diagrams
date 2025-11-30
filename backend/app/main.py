import os
import tempfile
import json
from typing import Union

from app.util import logger
from fastapi import FastAPI, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.services.openai_service import OpenAIService
from app.services.parse_puml_service import PUMLParser
from app.services.kruskals_algorithm import Graph

from fastapi import Depends, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.schemas.user import UserListItem, UserRegister, UserResponse

from app.services.security_service import hash_password

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
    
    # Build message with PUML content and history
    full_message = f"PlantUML diagram:\n{content}\n\nConversation history:\n{json.dumps(history_list, indent=2)}\n\nThe message with the latest timestamp is the current request."
    
    messages = [{"role": "user", "content": full_message}]
    response = service.chat(messages)

    return {"response": response}


@app.post("/api/processPUML")
def process_puml(file: UploadFile):
    logger.log("/api/processPUML", level="info")
    parser = PUMLParser("app/services/parser_config.json")
    source_path = None
    output_path = None
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

        logger.log(f"parse_file: {parsed}", level="debug")
        graph = Graph(parsed)
        reduced = graph.kruskals_algorithm()
        logger.log(f"kruskals_algorithm: {reduced}", level="debug")
        reduced = graph.extract_solution(reduced)
        logger.log(f"extract_solution: {reduced}", level="debug")

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
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")
    user = User(email=user_data.email, password_hash=hash_password(user_data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
