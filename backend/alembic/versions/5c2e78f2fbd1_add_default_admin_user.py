"""add default admin user

Revision ID: 5c2e78f2fbd1
Revises: ce5688f45122
Create Date: 2025-11-21 22:17:01.575891

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.sql import table, column
from sqlalchemy import Integer, String
import hashlib


# revision identifiers, used by Alembic.
revision: str = '5c2e78f2fbd1'
down_revision: Union[str, Sequence[str], None] = 'ce5688f45122'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def upgrade() -> None:
    """Upgrade schema."""
    users_table = table(
        "users",
        column("id", Integer),
        column("email", String),
        column("password_hash", String),
    )

    op.bulk_insert(users_table, [
        {
            "id": 1,
            "email": "admin@example.com",
            "password_hash": hash_password("admin")
        }
    ])


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE FROM users WHERE id = 1")
