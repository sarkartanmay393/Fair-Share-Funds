import uuid
from sqlalchemy import JSON, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app import db


class User(db.Model):
    __tablename__ = 'users'
    id: Mapped[str] =  mapped_column(String, primary_key=True, unique=True, default=str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    rooms: Mapped[JSON] = mapped_column(JSON, nullable=True)
    balance_sheet: Mapped[JSON] = mapped_column(JSON, nullable=True)


class Room(db.Model):
    __tablename__ = 'rooms'
    id: Mapped[str] = mapped_column(String, primary_key=True, unique=True, default=str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    user_ids: Mapped[JSON] = mapped_column(JSON, nullable=False)
    history: Mapped[JSON] =  mapped_column(JSON, nullable=True)
    balance_sheet: Mapped[JSON] =  mapped_column(JSON, nullable=True) # this `bs` is local to Rooms, based on user_ids.