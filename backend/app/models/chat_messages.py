from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db import Base

class RoleEnum(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(
        String(36),
        ForeignKey(
            "chat_threads.id",
            ondelete="CASCADE",
            onupdate="CASCADE"),
        nullable=False)
    role = Column(
        SQLEnum(RoleEnum, native_enum=False),
        nullable=False
    )
    content = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    _metadata = Column(JSON, nullable=True)

    files = relationship(
        "ChatFiles",
        back_populates="message",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, thread_id='{self.thread_id}', role='{self.role}', content='{self.content}' created_at='{self.created_at}')>"
