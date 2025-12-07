from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class ChatFileDomain:
    message_id: int
    file_name: str
    file_content: str
    uploaded_at: datetime = field(default_factory=datetime.utcnow)

    @classmethod
    def create(cls,
               message_id: int,
               file_content: str,
               file_name: str) -> ChatFileDomain:
        if message_id is None or message_id <= 0:
            raise ValueError("Message ID must be a positive integer.")
        if file_content is None or file_content.strip() == "":
            raise ValueError("File content cannot be empty.")
        if file_name is None or file_name.strip() == "":
            fine_name = "untitled.puml"

        return cls(
            message_id=message_id,
            file_name=file_name,
            file_content=file_content)
