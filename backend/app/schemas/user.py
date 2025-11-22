from pydantic import BaseModel, EmailStr

class UserListItem(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True
