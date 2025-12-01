from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
from app.config import settings

REFRESH_TOKEN_EXPIRE_DAYS = settings.refresh_token_expire_days

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    # map to user id
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, nullable=False)  # SHA256 of refresh token
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False) # might be useful later

    user = relationship("User", back_populates="refresh_tokens")

    @staticmethod
    def generate_expiration():
        return datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
