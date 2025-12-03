from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    # the user can have multiple refresh tokens, for example on phone/PC...
    # when a user logs out from one device we want to keep him logged in on the other
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
