from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


app = Flask(__name__)
from app import config


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(app, model_class=Base)
jwt = JWTManager(app)
api = Api(app)
bc = Bcrypt(app)
migrate = Migrate(app, db)

from app import models, resources

# if __name__ == "__main__":
#     app.run(debug=True)
