"""merge branches

Revision ID: ffbcf548b830
Revises: 6fb4fb57503d
Create Date: 2025-12-16 16:35:58.097984

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ffbcf548b830'
down_revision: Union[str, Sequence[str], None] = '6fb4fb57503d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
