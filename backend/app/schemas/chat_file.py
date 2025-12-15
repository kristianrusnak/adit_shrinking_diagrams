from datetime import datetime
from pydantic import BaseModel


class ChatFileSchema(BaseModel):
    id: int
    file_name: str
    file_content: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
