import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class ChatThread(Base):
    __tablename__ = "chat_threads"

    __updatable_fields__ = {"title", "updated_at", "last_message_at", "last_diagram_file_id"}

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
        nullable=False
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_message_at = Column(DateTime, nullable=True)
    last_diagram_file_id = Column(Integer, ForeignKey("chat_files.id"), nullable=True)

    @classmethod
    def get_updatable_fields(cls) -> set[str]:
        return cls.__updatable_fields__

    def __repr__(self):
        return f"<ChatThread(id={self.id}, user_id={self.user_id}, title={self.title})>"
