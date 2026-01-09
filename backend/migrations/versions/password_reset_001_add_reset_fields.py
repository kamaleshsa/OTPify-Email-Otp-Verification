"""Add password reset fields to User model

Revision ID: password_reset_001
Revises: 81f3d1eb17d7
Create Date: 2026-01-09 13:24:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "password_reset_001"
down_revision = "81f3d1eb17d7"
branch_labels = None
depends_on = None


def upgrade():
    # Add reset_token and reset_token_expires columns to users table
    op.add_column("users", sa.Column("reset_token", sa.String(), nullable=True))
    op.add_column(
        "users",
        sa.Column("reset_token_expires", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        op.f("ix_users_reset_token"), "users", ["reset_token"], unique=False
    )


def downgrade():
    # Remove reset_token and reset_token_expires columns from users table
    op.drop_index(op.f("ix_users_reset_token"), table_name="users")
    op.drop_column("users", "reset_token_expires")
    op.drop_column("users", "reset_token")
