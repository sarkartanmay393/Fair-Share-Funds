from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tanmay123!@localhost/fsfdb'


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(app, model_class=Base)
migrate = Migrate(app, db)


@app.route("/")
def hello():
    users = db.session.execute(db.select(User)).scalars()
    print(f'{users.all()}')
    return "Hello World!"


@app.route("/signup")
def singup():
    user = User(
        username="tanmaysarkar",
        password="Tanmay1!",
    )
    db.session.add(user)
    db.session.commit()
    print(f'{user}')
    return "Hello World!"


if __name__ == "__main__":
    app.run()
