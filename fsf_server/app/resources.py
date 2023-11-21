import random
from flask import request, jsonify
from mysqlx import IntegrityError
from flask_restful import Resource
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

from app import api, db, bc
from app.models import User


class EntryResource(Resource):
    def get(self):
        return '* Running on http://127.0.0.1:5000'


class SignupResource(Resource):
    def post(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON in the request'}, 400

        try:
            user = User(
                email=req.get('email'),
                password=bc.generate_password_hash(req.get('password')).decode('utf-8'),
                name=req.get('name'),
                username=str(req.get('email')).split('@')[0],
            )

            db.session.add(user)
            db.session.commit()
            return {
                'message': 'Account Created Successfully!',
                'user': {
                    'email': user.email,
                    'password': req.get('password'),
                }
            }, 201

        except IntegrityError as e:
            db.session.rollback()
            return {'error': 'Email or username already exists'}, 409

        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500


class LoginResource(Resource):
    def post(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON in the request'}, 400

        email = req.get('email')
        password = req.get('password')

        try:
            user = User.query.filter_by(email=email).first()
            if user and  bc.check_password_hash(user.password, password):
                access_token=create_access_token(identity=user.id)
                response = {
                    'email': user.email,
                    'username': user.username,
                    'id': user.id,
                    'name': user.name
                }
                headers = {
                    'Authorization': 'Bearer ' + access_token
                }
                return response , 200, headers
            else:
                return {'error': 'user data not matched'}, 401

        except Exception as e:
            return {'error': str(e)}, 500
        

        


api.add_resource(EntryResource, '/')
api.add_resource(LoginResource, '/login')
api.add_resource(SignupResource, '/signup')

# # Protected endpoint that requires a valid JWT token
# @app.route('/protected', methods=['GET'])
# @jwt_required()
# def protected():
#     # Access the identity of the current user with get_jwt_identity
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200

