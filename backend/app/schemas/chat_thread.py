# app/schemas/chat_thread.py
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ChatThreadSchema(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    last_message_at: Optional[datetime] = None
    last_diagram_file_id: Optional[int] = None

    class Config:
        from_attributes = True


class ThreadRenameRequest(BaseModel):
    thread_id: str
    new_title: str
