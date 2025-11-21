"""add default admin user

Revision ID: 82ef554f43f0
Revises: 18e8137e3e34
Create Date: 2025-11-21 21:31:16.165261

"""
import hashlib
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import Integer, String


# revision identifiers, used by Alembic.
revision: str = '82ef554f43f0'
down_revision: Union[str, Sequence[str], None] = '18e8137e3e34'
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
