from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class ChatThreadDomain:
    user_id: int
    title: str
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    last_message_at: datetime | None = None
    last_diagram_file_id: int | None = None

    def rename_title(self, new_title: str) -> None:
        if new_title is None or new_title.strip() == "":
            raise ValueError("Title cannot be empty.")
        if len(new_title) < 3:
            raise ValueError("Title must be at least 3 characters long.")
        self.title = new_title

    def change_updated_at(self, new_time: datetime) -> None:
        if new_time is None:
            raise ValueError("Updated time cannot be None.")
        if new_time < self.created_at:
            raise ValueError("Updated time cannot be earlier than created time.")
        self.updated_at = new_time

    def change_last_message_at(self, new_time: datetime) -> None:
        if new_time is None:
            raise ValueError("Last message time cannot be None.")
        if new_time < self.created_at:
            raise ValueError("Last message time cannot be earlier than created time.")
        self.last_message_at = new_time

    def change_last_diagram_file_id(self, new_file_id: int) -> None:
        if new_file_id is None or new_file_id <= 0:
            raise ValueError("File ID must be a positive integer.")
        self.last_diagram_file_id = new_file_id

    @classmethod
    def create(cls,
               user_id: int,
               title: str | None = None) -> ChatThreadDomain:
        if user_id is None or user_id <= 0:
            raise ValueError("User ID must be a positive integer.")

        if title is None:
            title = "New Chat Thread"

        return cls(user_id=user_id, title=title)
