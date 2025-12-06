from sqlalchemy.orm import Session
from app.models.chat_files import ChatFiles

class ChatFilesRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self,
               message_id: int,
               file_name: str,
               file_content: str) -> ChatFiles:
        """
        Create a new chat file.

        Parameters
        ----------
        message_id: int
            Message ID.
        file_name: str
            Name of the file.
        file_content: str
            Content of the file.

        Returns
        -------
        ChatFiles
            The created ChatFiles object.
        """

        new_file = ChatFiles(
            message_id=message_id,
            file_name=file_name,
            file_content=file_content
        )

        self.db.add(new_file)
        self.db.commit()
        self.db.refresh(new_file)
        return new_file

    def get_by_message_id(self,
                          message_id: int) -> list[type[ChatFiles]]:
        """
        List all files for a message.

        Parameters:
        ----------
        message_id: int
            Message ID

        Returns:
        --------
        list[type[ChatFiles]]
            List of ChatFiles objects.
        """

        return (
            self.db.query(ChatFiles)
            .filter(
                ChatFiles.message_id == message_id
            ).all()
        )
