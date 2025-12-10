from datetime import datetime
from typing import List

from pydantic import BaseModel
from app.models.chat_messages import RoleEnum
from app.schemas.chat_file import ChatFileSchema


class ChatMessageSchema(BaseModel):
    id: int
    thread_id: str
    role: RoleEnum
    content: str
    created_at: datetime

    files: List[ChatFileSchema] = []

    class Config:
        from_attributes = True
