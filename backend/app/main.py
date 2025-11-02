from typing import Union

from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.openai_service import OpenAIService

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


@app.post("/api/sendMessage")
def message_controller(file: UploadFile, message: str = Form(...)):
    try:
        content_bytes = file.file.read()
        content = content_bytes.decode("utf-8")
    except Exception:
        raise HTTPException(
            status_code=400, detail="Nepodarilo sa prečítať textový súbor"
        )

    full_message = f"{content} | {message}"
    service = OpenAIService()

    messages = [{"role": "user", "content": full_message}]

    response = service.chat(messages)

    return {"response": response}
