from typing import Optional, Any
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from app.models.chat_threads import ChatThread

class ChatThreadRepository:
    def __init__(self, db: Session):
        self.db = db
        self._updatable_fields = ChatThread.get_updatable_fields()

    def create(self,
               user_id: int,
               title: str) -> ChatThread:
        """
        Create a new chat thread.

        Parameters
        ----------
        user_id: int
            User ID.
        title: str
            Thread title.

        Returns
        -------
        ChatThread
            The created ChatThread object.
        """

        new_thread = ChatThread(
            user_id=user_id,
            title=title
        )

        self.db.add(new_thread)
        self.db.commit()
        self.db.refresh(new_thread)
        return new_thread

    def get_by_id(self,
                  thread_id: str) -> Optional[ChatThread]:
        """
        Get a single thread by its string ID.

        Parameters:
        ----------
        thread_id: str
            Thread ID

        Returns:
        --------
        Optional[ChatThread]
            ChatThread object or None if not found.
        """

        return (
            self.db.query(ChatThread)
            .filter(
                ChatThread.id == thread_id
            ).first()
        )

    def get_all_by_user_id(self,
                           user_id: int,
                           order = "ASC") -> list[ChatThread]:
        """
        List all threads for user.

        Parameters:
        ----------
        user_id: int
            User ID.
        order: str
            Order by time {ASC or DESC}.

        Returns:
        --------
        list[type[ChatThread]]
            Ordered list of ChatThread objects.
        """

        ordering = asc(ChatThread.updated_at) if order == "ASC" else desc(ChatThread.updated_at)

        return (
            self.db.query(ChatThread)
            .filter(
                ChatThread.user_id == user_id
            ).order_by(ordering)
            .all()
        )

    def delete(self, thread_id: str) -> bool:
        """
        Delete a thread by ID. Returns True if something was deleted.

        Parameters:
        ----------
        thread_id: str
            Thread ID.

        --- Returns
        bool
            True if deleted, False otherwise
        """

        thread = self.get_by_id(thread_id)
        if not thread:
            return False

        self.db.delete(thread)
        self.db.commit()
        return True

    def update(self,
               thread_id: str,
                **kwargs: Any) -> Optional[ChatThread]:
        """
        Update allowed fields of a ChatThread by ID.

        Parameters:
        ----------
        thread_id: str
            ID of the chat thread.
        kwargs: Any
            Fields to update (must be in _updatable_fields).

        Returns:
        --------
        Optional[ChatThread]
            Updated thread or None if not found.
        """

        thread = self.get_by_id(thread_id)
        if not thread:
            return None

        for key, value in kwargs.items():
            if key not in self._updatable_fields:
                raise ValueError(f"Field '{key}' is not allowed to be updated.")

            setattr(thread, key, value)

        self.db.commit()
        self.db.refresh(thread)
        return thread
