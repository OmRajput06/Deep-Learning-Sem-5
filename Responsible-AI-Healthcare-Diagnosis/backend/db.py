# db.py
import os
from urllib.parse import quote_plus
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Naming convention to avoid alembic issues later
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)

def build_db_uri():
    user = os.getenv("DB_USER", "root")
    pwd = os.getenv("DB_PASSWORD", "root")
    host = os.getenv("DB_HOST", "127.0.0.1")
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "cureit_db")
    # PyMySQL driver
    return f"mysql+pymysql://{quote_plus(user)}:{quote_plus(pwd)}@{host}:{port}/{name}?charset=utf8mb4"
