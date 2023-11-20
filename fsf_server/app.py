import random
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from mysqlx import IntegrityError
from sqlalchemy.orm import DeclarativeBase
from flask_restful import Api, Resource
from flask_migrate import Migrate

from models import User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tanmay123!@localhost/fsfdb'


class Base(DeclarativeBase):
    pass


DB = SQLAlchemy(app, model_class=Base)
api = Api(app)
# migrate = Migrate(app, db)


@app.route("/")
def hello():
    users = DB.session.execute(DB.select(User)).scalars()
    print(f'{users.first().name}')
    return 'sss'


class SignupResource(Resource):
    def post(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON in the request'}, 400

        try:
            user = User(
                id=random.random(),
                email=req.get('email'),
                password=req.get('password'),
                name=req.get('name'),
                username=req.get('email').split('@')[0],
            )
            DB.session.add(user)
            DB.session.commit()
            return {
                'message': 'Account Created Successfully!',
                'user': user,
            }, 201

        except IntegrityError as e:
            DB.session.rollback()
            return {'error': 'Email or username already exists'}, 409

        except Exception as e:
            DB.session.rollback()
            return {'error': str(e)}, 500


class LoginResource(Resource):
    def post(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON in the request'}, 400
        
        email = req.get('email')
        password = req.get('password')

        try:
            user = User.query.filter_by(email=str(email)).first()
            if user and str(user.password) == str(password):
                return {'user': str(user.id)}, 200
            else:
                return {'error': 'user data not matched'}, 401

        except Exception as e:
            return {'error': str(e)}, 500


api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')

if __name__ == "__main__":
    app.run(dubug=True)
