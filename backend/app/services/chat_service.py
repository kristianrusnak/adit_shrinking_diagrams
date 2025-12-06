from app.models.chat_threads import ChatThread
from app.models.chat_messages import ChatMessage
from app.models.chat_files import ChatFiles

from app.repository.chat_threads_repository import ChatThreadRepository
from app.repository.chat_messages_repository import ChatMessageRepository
from app.repository.chat_files_repository import ChatFilesRepository

from app.domain.chat_thread import ChatThreadDomain
from app.domain.chat_message import ChatMessageDomain
from app.domain.chat_files import ChatFileDomain

def _to_chat_thread_domain(chat_thread: ChatThread) -> ChatThreadDomain:
    return ChatThreadDomain(
        user_id=chat_thread.user_id,
        title=chat_thread.title,
        created_at=chat_thread.created_at,
        updated_at=chat_thread.updated_at,
        last_message_at=chat_thread.last_message_at,
        last_diagram_file_id=chat_thread.last_diagram_file_id
    )

def _to_chat_message_domain(chat_message: ChatMessage) -> ChatMessageDomain:
    return ChatMessageDomain(
        thread_id=chat_message.thread_id,
        role=chat_message.role,
        content=chat_message.content,
        created_at=chat_message.created_at
    )

def _to_chat_file_domain(chat_file: ChatFiles) -> ChatFileDomain:
    return ChatFileDomain(
        message_id=chat_file.message_id,
        file_name=chat_file.file_name,
        file_content=chat_file.file_content,
        uploaded_at=chat_file.uploaded_at
    )

class ChatService:
    def __init__(self, db_session):
        self.db_session = db_session

    def retrieve_threads(self,
                        user_id: int,
                        order: str = "ASC") -> list[ChatThread]:
        """
        Retrieve chat threads for a user.

        Parameters:
        -----------
        user_id: int
            User ID.
        order: str
            Order by time {ASC or DESC}.

        Returns:
        --------
        list[ChatThread]
            Ordered list of ChatThread objects.
        """

        if order not in ("ASC", "DESC"):
            raise ValueError("Order must be either 'ASC' or 'DESC'.")

        repo = ChatThreadRepository(self.db_session)
        return repo.get_all_by_user_id(user_id, order)

    def create_thread(self,
                      user_id: int,
                      title: str | None) -> ChatThread:
        """
        Create a new chat thread for a user.

        Parameters:
        -----------
        user_id: int
            User ID.
        title: str | None
            Title of the chat thread.

        Returns:
        --------
        ChatThread
            The created ChatThread object.
        """

        repo = ChatThreadRepository(self.db_session)

        domain_thread = ChatThreadDomain.create(
            user_id=user_id,
            title=title
        )

        model = repo.create(
            user_id=domain_thread.user_id,
            title=domain_thread.title
        )
        return model


    def delete_thread(self,
                      user_id: int,
                      thread_id: str) -> None:
        """
        Delete a chat thread for a user.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.
        """

        repo = ChatThreadRepository(self.db_session)
        model = repo.get_by_id(thread_id)

        if not model:
            raise ValueError("Thread not found.")
        if model.user_id != user_id:
            raise PermissionError("User does not have permission to delete this thread.")

        result = repo.delete(thread_id)

        if not result:
            raise RuntimeError("Failed to delete thread.")

    def update_thread(self,
                      user_id: int,
                      thread_id: str,
                      title: str | None) -> ChatThread:
        """
        Update a chat thread's title.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.
        title: str | None
            New title for the chat thread.

        Returns:
        --------
        ChatThread
            The updated ChatThread object.
        """

        repo = ChatThreadRepository(self.db_session)
        model = repo.get_by_id(thread_id)

        if not model:
            raise ValueError("Thread not found.")
        if model.user_id != user_id:
            raise PermissionError("User does not have permission to update this thread.")

        domain_thread = _to_chat_thread_domain(model)

        domain_thread.rename_title(title)

        updated_model = repo.update(
            thread_id=thread_id,
            title=domain_thread.title
        )

        if not updated_model:
            raise RuntimeError("Failed to update thread.")

        return updated_model


    def retrieve_messages(self,
                          user_id: int,
                          thread_id: str,
                          order: str = "ASC") -> list[ChatMessage]:
        """
        Retrieve chat messages for a thread.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.
        order: str
            Order by time {ASC or DESC}.

        Returns:
        --------
        list[ChatMessage]
            List of ChatMessage objects.
        """

        repo = ChatThreadRepository(self.db_session)

        thread = repo.get_by_id(thread_id)

        if not thread:
            raise ValueError("Thread not found.")
        if thread.user_id != user_id:
            raise PermissionError("User does not have permission to access this thread.")

        repo = ChatMessageRepository(self.db_session)

        if order not in ("ASC", "DESC"):
            raise ValueError("Order must be either 'ASC' or 'DESC'.")

        return repo.get_by_thread_id(thread_id, order)

    def record_message(self,
                       user_id: int,
                       thread_id: str,
                       role: str,
                       content: str) -> ChatMessage:
        """
        Record a new chat message in a thread.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.
        role: str
            Role of the message sender.
        content: str
            Content of the message.

        Returns:
        --------
        ChatMessage
            The created ChatMessage object.
        """

        thread_repo = ChatThreadRepository(self.db_session)

        thread = thread_repo.get_by_id(thread_id)

        if not thread:
            raise ValueError("Thread not found.")
        if thread.user_id != user_id:
            raise PermissionError("User does not have permission to access this thread.")

        message_repo = ChatMessageRepository(self.db_session)

        domain_message = ChatMessageDomain.create(
            thread_id=thread_id,
            role=role,
            content=content
        )

        model = message_repo.create(
            thread_id=domain_message.thread_id,
            role=domain_message.role,
            content=domain_message.content
        )

        return model

    def upload_file(self,
                    user_id: int,
                    message_id: int,
                    file_name: str,
                    file_content: str) -> ChatFiles:
        """
        Upload a file associated with a chat message.

        Parameters:
        -----------
        user_id: int
            User ID.
        message_id: str
            Message ID.
        file_name: str
            Name of the file.
        file_content: str
            Content of the file.

        Returns:
        --------
        ChatFiles
            The created ChatFiles object.
        """

        message_repo = ChatMessageRepository(self.db_session)

        message = message_repo.get_by_id(message_id)

        if not message:
            raise ValueError("Message not found.")

        thread_repo = ChatThreadRepository(self.db_session)

        thread = thread_repo.get_by_id(message.thread_id)

        if not thread:
            raise ValueError("Thread not found.")
        if thread.user_id != user_id:
            raise PermissionError("User does not have permission to access this message.")

        file_repo = ChatFilesRepository(self.db_session)

        domain_file = ChatFileDomain.create(
            message_id=message_id,
            file_name=file_name,
            file_content=file_content
        )

        model = file_repo.create(
            message_id=domain_file.message_id,
            file_name=domain_file.file_name,
            file_content=domain_file.file_content
        )

        return model
