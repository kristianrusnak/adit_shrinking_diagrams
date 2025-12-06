from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class ChatFiles(Base):
    __tablename__ = "chat_files"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(
        Integer,
        ForeignKey(
            "chat_messages.id",
            ondelete="CASCADE",
            onupdate="CASCADE"),
        nullable=False)
    file_name = Column(String, nullable=False)
    file_content = Column(String, nullable=False)
    uploaded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
