from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from app.models.chat_messages import RoleEnum

@dataclass
class ChatMessageDomain:
    thread_id: str
    role: str
    content: str
    created_at: datetime = field(default_factory=datetime.utcnow)

    @classmethod
    def create(cls,
               thread_id: str,
               role: str,
               content: str) -> ChatMessageDomain:
        if thread_id is None or len(thread_id) == 0:
            raise ValueError("Invalid thread_id specified.")
        if role not in (RoleEnum.user, RoleEnum.assistant, RoleEnum.system):
            raise ValueError("Invalid role specified.")
        if content is None or content.strip() == "":
            raise ValueError("Content cannot be empty.")

        return cls(
            thread_id=thread_id,
            role=role,
            content=content)
