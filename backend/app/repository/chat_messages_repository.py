from typing import Optional
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session, selectinload
from app.models.chat_messages import ChatMessage

class ChatMessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self,
               thread_id: str,
               role: str,
               content: str) -> ChatMessage:
        """
        Create a new chat message.

        Parameters
        ----------
        thread_id: str
            Thread ID.
        role: int
            Type of role.
        content: str
            Message content.

        Returns
        -------
        ChatMessage
            The created ChatMessage object.
        """

        new_message = ChatMessage(
            thread_id=thread_id,
            role=role,
            content=content
        )

        self.db.add(new_message)
        self.db.flush()
        self.db.refresh(new_message)
        return new_message

    def get_by_id(self, message_id: int) -> Optional[ChatMessage]:
        """
        Get a chat message by its ID.

        Parameters:
        ----------
        message_id: int
            Message ID.

        Returns:
        --------
        Optional[ChatMessage]
            The ChatMessage object if found, else None.
        """
        return (
            self.db.query(ChatMessage)
            .options(selectinload(ChatMessage.files))
            .filter(ChatMessage.id == message_id)
            .first()
        )

    def get_by_thread_id(self,
                         thread_id: str,
                         order: str = "ASC") -> list[ChatMessage]:
        """
        List all messages for a thread.

        Parameters:
        ----------
        thread_id: str
            Thread ID
        order: str
            Order of messages, either "ASC" or "DESC".

        Returns:
        --------
        list[type[ChatMessage]]
            List of ChatMessage objects.
        """

        ordering = asc(ChatMessage.created_at) if order == "ASC" else desc(ChatMessage.created_at)

        return (
            self.db.query(ChatMessage)
            .options(selectinload(ChatMessage.files))
            .filter(ChatMessage.thread_id == thread_id)
            .order_by(ordering)
            .all()
        )
