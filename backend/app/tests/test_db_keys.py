from app.db import Base
from app.models.user import User
from app.models.chat_threads import ChatThread
from app.models.chat_messages import ChatMessage
from app.models.chat_files import ChatFiles

print(Base.metadata.tables.keys())
