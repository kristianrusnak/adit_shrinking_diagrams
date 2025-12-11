from datetime import datetime

from app.services.openai_service import OpenAIService

from app.models.chat_threads import ChatThread
from app.models.chat_messages import ChatMessage, RoleEnum
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

def _to_ai_message_list(messages: list[ChatMessage]) -> list[dict]:
    ai_messages = []

    for msg in messages:

        full_content = msg.content

        if msg.files:
            for f in msg.files:
                full_content += (
                    f"\n\n--- FILE: {f.file_name} ---\n"
                    f"{f.file_content}\n"
                    f"--- END FILE ---"
                )

        ai_messages.append({
            "role": msg.role.value if hasattr(msg.role, "value") else msg.role,
            "content": full_content
        })

    return ai_messages

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
                      title: str | None,
                      commit: bool = False) -> ChatThread:
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

        if commit:
            self.db_session.commit()

        return model

    def create_new_thread_with_prompt(self,
                      user_id: int,
                      title: str | None,
                      prompt_message: str,
                      prompt_file: str | None = None,
                      prompt_file_name: str | None = None) -> tuple[ChatThread, ChatMessage]:
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

        # repo = ChatThreadRepository(self.db_session)
        #
        # domain_thread = ChatThreadDomain.create(
        #     user_id=user_id,
        #     title=title
        # )
        #
        # model = repo.create(
        #     user_id=domain_thread.user_id,
        #     title=domain_thread.title
        # )
        # return model

        with self.db_session.begin():
            # Create new thread
            thread = self.create_thread(
                user_id=user_id,
                title=title
            )

            # Create initial prompt message in the thread
            input_message = self.record_message(
                user_id=user_id,
                thread_id=thread.id,
                role=RoleEnum.user.value,
                content=prompt_message
            )

            # if there is a prompt file, create it
            if prompt_file:
                # Create file associated with the input message
                file = self.record_file(
                    user_id=user_id,
                    message_id=input_message.id,
                    file_content=prompt_file,
                    file_name=prompt_file_name
                )

                # Update the last_diagram_file_id in the thread
                self.update_last_file_in_thread(
                    user_id=user_id,
                    thread_id=thread.id,
                    file_id=file.id
                )

            # Send to AI and get response
            generated_message = self.sent_to_ai(
                user_id=user_id,
                thread_id=thread.id
            )

            # Record AI response message in the thread
            output_message = self.record_message(
                user_id=user_id,
                thread_id=thread.id,
                role=RoleEnum.assistant.value,
                content=generated_message
            )

            # Update the last_message_at in the thread
            self.update_last_message_in_thread(
                user_id=user_id,
                thread_id=thread.id,
                timestamp=output_message.created_at
            )

            return thread, output_message


    def delete_thread(self,
                      user_id: int,
                      thread_id: str,
                      commit: bool = False) -> None:
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

        if commit:
            self.db_session.commit()

    def update_last_message_in_thread(self,
                                      user_id: int,
                                      thread_id: str,
                                      timestamp: datetime,
                                      commit: bool = False) -> ChatThread:
        """
        Update the last message timestamp in a chat thread.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.

        Returns:
        --------
        ChatThread
            The updated ChatThread object.
        """

        repo = ChatThreadRepository(self.db_session)
        thread = repo.get_by_id(thread_id)

        if not thread:
            raise ValueError("Thread not found.")
        if thread.user_id != user_id:
            raise PermissionError("User does not have permission to update this thread.")

        domain_thread = _to_chat_thread_domain(thread)

        domain_thread.change_last_message_at(timestamp)
        domain_thread.change_updated_at(timestamp)

        updated_model = repo.update(
            thread_id=thread_id,
            last_message_at=domain_thread.last_message_at,
            updated_at=domain_thread.updated_at
        )

        if not updated_model:
            raise RuntimeError("Failed to update thread.")

        if commit:
            self.db_session.commit()

        return updated_model

    def update_last_file_in_thread(self,
                                   user_id: int,
                                   thread_id: str,
                                   file_id: int,
                                   commit: bool = False) -> ChatThread:
        """
        Update the last diagram file ID in a chat thread.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.
        file_id: int
            File ID to set as last_diagram_file_id.

        Returns:
        --------
        ChatThread
            The updated ChatThread object.
        """

        repo = ChatThreadRepository(self.db_session)
        thread = repo.get_by_id(thread_id)

        if not thread:
            raise ValueError("Thread not found.")
        if thread.user_id != user_id:
            raise PermissionError("User does not have permission to update this thread.")

        domain_thread = _to_chat_thread_domain(thread)

        domain_thread.change_last_diagram_file_id(file_id)

        updated_model = repo.update(
            thread_id=thread_id,
            last_diagram_file_id=domain_thread.last_diagram_file_id
        )

        if not updated_model:
            raise RuntimeError("Failed to update thread.")

        if commit:
            self.db_session.commit()

        return updated_model

    def rename_thread(self,
                      user_id: int,
                      thread_id: str,
                      title: str | None,
                      commit: bool = False) -> ChatThread:
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

        if commit:
            self.db_session.commit()

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
                       content: str,
                       commit: bool = False) -> ChatMessage:
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

        if commit:
            self.db_session.commit()

        return model

    def record_file(self,
                    user_id: int,
                    message_id: int,
                    file_content: str,
                    file_name: str | None,
                    commit: bool = False) -> ChatFiles:
        """
        Record a new chat file associated with a message.

        Parameters:
        -----------
        user_id: int
            User ID.
        message_id: int
            Message ID.
        file_content: str
            Content of the file.
        file_name: str
            Name of the file.

        Returns:
        --------
        ChatFiles
            The created ChatFiles object.

        Warnings:
        --------
        This method does not update the last_diagram_file_id in the associated thread.
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
            raise PermissionError("User does not have permission to access this message's thread.")

        file_repo = ChatFilesRepository(self.db_session)

        domain_file = ChatFileDomain.create(
            message_id=message_id,
            file_name=file_name,
            file_content=file_content
        )

        file = file_repo.create(
            message_id=domain_file.message_id,
            file_name=domain_file.file_name,
            file_content=domain_file.file_content
        )

        if commit:
            self.db_session.commit()

        return file

    def prompt_message(self,
                       user_id: int,
                       thread_id: str,
                       prompt_message: str,
                       prompt_file: str | None = None,
                       prompt_file_name: str | None = None) -> ChatMessage:
        """
        Send a prompt message to AI and get the response.

        Parameters:
        -----------
        user_id: int
            User ID.
        thread_id: str
            Thread ID.
        prompt_message: str
            Content of the prompt message.
        prompt_file: str | None
            Content of the prompt file.
        prompt_file_name: str | None
            Name of the prompt file.

        Returns:
        --------
        str
            AI generated response.
        """

        with self.db_session.begin():

            # Create initial prompt message in the thread
            input_message = self.record_message(
                user_id=user_id,
                thread_id=thread_id,
                role=RoleEnum.user.value,
                content=prompt_message
            )

            # if there is a prompt file, create it
            if prompt_file:
                # Create file associated with the input message
                file = self.record_file(
                    user_id=user_id,
                    message_id=input_message.id,
                    file_content=prompt_file,
                    file_name=prompt_file_name
                )

                # Update the last_diagram_file_id in the thread
                self.update_last_file_in_thread(
                    user_id=user_id,
                    thread_id=thread_id,
                    file_id=file.id
                )

            # Send to AI and get response
            generated_message = self.sent_to_ai(
                user_id=user_id,
                thread_id=thread_id
            )

            # Record AI response message in the thread
            output_message = self.record_message(
                user_id=user_id,
                thread_id=thread_id,
                role=RoleEnum.assistant.value,
                content=generated_message
            )

            # Update the last_message_at in the thread
            self.update_last_message_in_thread(
                user_id=user_id,
                thread_id=thread_id,
                timestamp=output_message.created_at
            )

            return output_message

    def sent_to_ai(self,
                   user_id: int,
                   thread_id: str) -> str:
        thread_repo = ChatThreadRepository(self.db_session)
        thread = thread_repo.get_by_id(thread_id)

        if not thread:
            raise ValueError("Thread not found.")
        if thread.user_id != user_id:
            raise PermissionError("User does not have permission to access this thread.")

        message_repo = ChatMessageRepository(self.db_session)
        messages = message_repo.get_by_thread_id(
            thread_id=thread_id,
            order="ASC"
        )

        ai_messages = _to_ai_message_list(messages)

        openai = OpenAIService()
        ai_response = openai.chat(ai_messages)

        return ai_response
