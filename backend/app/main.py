import os
import tempfile
from typing import Union

from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.openai_service import OpenAIService
from app.services.parse_puml_service import PUMLParser
from app.services.kruskals_algorithm import Graph

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User

app = FastAPI()

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
def message_controller(file: UploadFile, message: str = Form(...)):
    try:
        content_bytes = file.file.read()
        content = content_bytes.decode("utf-8")
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to read PUML file")

    full_message = f"{content} | {message}"
    service = OpenAIService()

    messages = [{"role": "user", "content": full_message}]

    response = service.chat(messages)

    return {"response": response}


@app.post("/api/processPUML")
def process_puml(file: UploadFile):
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

        graph = Graph(parsed)
        reduced = graph.kruskals_algorithm()
        reduced = graph.extract_solution(reduced)

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

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
