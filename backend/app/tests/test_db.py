from app.db import Base

from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.chat_threads import ChatThread
from app.models.chat_messages import ChatMessage
from app.models.chat_files import ChatFiles

from app.services.chat_service import ChatService
from app.db import get_db
from app.models.chat_messages import RoleEnum

def test_db_connection():
    db = next(get_db())
    try:
        result = db.execute("SELECT 1").scalar()
        print("DB connection works:", result)
    finally:
        db.close()

def test_db_tables():
    db = next(get_db())
    try:
        db = next(get_db())
        tables = db.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
        print("Tables:", tables)
    finally:
        db.close()

def create_new_thread_with_prompt():
    db = next(get_db())
    chat_service = ChatService(db)

    output_message = chat_service.create_new_thread_with_prompt(
        user_id=2,
        title="Test Thread 2",
        prompt_message="Hello, this is a test 2",
        prompt_file=None,
        prompt_file_name=None
    )

    print("Created message:", output_message.content)

def create_empty_thread():
    db = next(get_db())
    chat_service = ChatService(db)

    thread = chat_service.create_thread(
        user_id=1,
        title="Empty thread",
        commit=True
    )

    print(f"Created thread: {thread.title} ({thread.id})")

def create_thread_with_one_message():
    db = next(get_db())
    chat_service = ChatService(db)

    thread = chat_service.create_thread(
        user_id=1,
        title="Minimal Test Thread"
    )

    message = chat_service.record_message(
        user_id=1,
        thread_id=thread.id,
        role=RoleEnum.user.value,
        content="Hello, this is a test message!"
    )

    chat_service.update_last_message_in_thread(
        user_id=1,
        thread_id=thread.id,
        timestamp=message.created_at
    )

    print(f"Created thread: {thread.title} ({thread.id})")
    print(f"Created message: {message.content} ({message.id})")

def add_message_to_existing_thread():
    db = next(get_db())
    chat_service = ChatService(db)

    thread_id = "22222222-2222-2222-2222-222222222222"
    thread_title = "Minimal Test Thread"

    msg = chat_service.record_message(
        user_id=1,
        thread_id=thread_id,
        role=RoleEnum.user.value,
        content="This is a test message 4",
        commit=True
    )
    print(f"Added message to thread '{thread_title}': {msg.content} (role={msg.role})")

    return msg

def add_file_to_message():
    db = next(get_db())
    chat_service = ChatService(db)

    # 6   2fb39d39-3b12-40c4-9936-ad3106304bc4  user       Hello, this is a test 2                                                  2025-12-11 20:31:27.701139

    file = chat_service.record_file(
        user_id=2,
        message_id=6,
        file_content="some file content here " * 100,
        file_name="test_file.puml",
        commit=True
    )

    print("Added file to message")
    return file
if __name__ == "__main__":

    # print(Base.metadata.tables.keys())
    # create_empty_thread()
    # create_new_thread_with_prompt()
    # test_db_connection()
    # test_db_tables()
    # create_thread_with_one_message()
    # add_message_to_existing_thread()
    add_file_to_message()

