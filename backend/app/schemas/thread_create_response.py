from pydantic import BaseModel
from app.schemas.chat_thread import ChatThreadSchema
from app.schemas.chat_message import ChatMessageSchema


class ThreadCreateResponse(BaseModel):
    thread: ChatThreadSchema
    response: ChatMessageSchema

    class Config:
        from_attributes = True
