from flask import jsonify, request, Response
from flask_restful import Resource
from mysqlx import IntegrityError
from flask_jwt_extended import decode_token, jwt_required, create_access_token, get_jwt_identity

from app import api, db, bc
from app.models import Room, User


class EntryResource(Resource):
    def get(self):
        return '* Running on http://127.0.0.1:5000'


class SignupResource(Resource):
    def post(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON in the request'}, 400

        try:
            email = req.get('email')
            password = bc.generate_password_hash(req.get('password')).decode('utf-8')
            name = req.get('name')
            username = str(req.get('email')).split('@')[0]
            
            user = User(
                email=email,
                password=password,
                name=name,
                username=username,
            )

            db.session.add(user)
            db.session.commit()

            access_token=create_access_token(identity=user.id, expires_delta=False)
            response = jsonify(
                email=str(user.email),
                username = str(user.username),
                id = str(user.id),
                name = str(user.name)
            )
            response.set_cookie('access_token', value=access_token, max_age=24 * 60 * 60)
            response.status_code = 201
            return response
        
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
                access_token=create_access_token(identity=user.id, expires_delta=False)
                response = jsonify(
                    email=str(user.email),
                    username = str(user.username),
                    id = str(user.id),
                    name = str(user.name)
                )
                response.set_cookie('access_token', value=access_token, max_age=24 * 60 * 60)
                response.status_code = 200
                return response
            else:
                return {'error': 'user data not matched'}, 401

        except Exception as e:
            return {'error': str(e)}, 500
        

class RoomResource(Resource):
    @jwt_required()
    def get(self, room_id):
        if not room_id:
            return {'error': 'no room id in the param'}, 400
        
        try:
            room = Room.query.get(str(room_id))
            if not room:
                return {'error': 'no room found by the id'}, 401
            
            return {
                'name': room.name,
                'user_ids': room.user_ids,
                'history': room.history,
                'balance_sheet': room.balance_sheet
            }, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
    @jwt_required()
    def put(self, room_id):
        if not room_id:
            return {'error': 'no room id in the param'}, 400
        
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON body in the request'}, 400

        try:
            room = Room.query.get(str(room_id))
            if not room:
                return {'error': 'no room found by the id'}, 401
            
            name = req.get('name')
            usernames = req.get('usernames')
            history = req.get('history')
            balance_sheet = req.get('balance_sheet')
            
            user_ids = []
            for username in usernames:
                user = User.query.filter_by(username=username).first()
                if user:
                    user_ids.append(str(user.id))
                else:
                    return {'error': f'User with username {username} not found'}, 404

            room.name = name
            room.user_ids = user_ids
            room.history = history
            room.balance_sheet = balance_sheet
            
            db.session.commit()

            return {
                'name': room.name,
                'user_ids': room.user_ids,
                'history': room.history,
                'balance_sheet': room.balance_sheet
            }, 200
        except Exception as e:
            return {'error': str(e)}, 500
        

class CreateRoomResource(Resource):
    @jwt_required()
    def post(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON in the request'}, 400
        
        try:
            name = req.get('name')
            usernames = req.get('usernames')
            balance_sheet = req.get('balance_sheet')
            history = req.get('history')
            user_ids = []

            for username in usernames:
                user = User.query.filter_by(username=username).first()
                if user:
                    user_ids.append(user.id)
                else:
                    return {'error': f'User with username {username} not found'}, 404

            room = Room(name=name, user_ids=user_ids, history=history, balance_sheet=balance_sheet)
            db.session.add(room)
            db.session.commit()

            return {
                'message': 'Room Created Successfully!',
                'room_id': room.id
                }, 201
        
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
       

class UserResource(Resource):
    @jwt_required()
    def put(self):
        req = request.get_json()
        if not req:
            return {'error': 'Invalid JSON body in the request'}, 400

        try:
            user_id = get_jwt_identity()

            name = req.get('name')
            rooms = req.get('rooms')
            balance_sheet = req.get('balance_sheet')

            user = User.query.get(str(user_id))
            if not user:
                return {'error': 'no user found by the id'}, 401

            user.name = name
            user.rooms = rooms
            user.balance_sheet = balance_sheet

            db.session.commit()

            return {
                'name': user.name,
                'rooms': user.rooms,
                'balance_sheet': user.balance_sheet
            }, 200
        except Exception as e:
            return {'error': str(e)}, 500
        


    def get(self):
        ck = request.cookies
        if not ck:
            return {'error': 'not authenticated.'}, 400
    
        user_id = decode_token(ck.get('access_token')).get('sub')
        try:
            user = User.query.get(str(user_id))
            if not user:
                return {'error': 'no user found by the id'}, 401
            response = {
                'id': user.id,
                'name': user.name,
                'rooms': user.rooms,
                'email': user.email,
                'username': user.username,
                'balance_sheet': user.balance_sheet
            }
            return response, 200
        except Exception as e:
            return { 'error': str(e) }, 500
        


api.add_resource(EntryResource, '/')
api.add_resource(LoginResource, '/api/login')
api.add_resource(SignupResource, '/api/signup')
api.add_resource(UserResource, '/api/user')
api.add_resource(CreateRoomResource, '/api/room')
api.add_resource(RoomResource, '/api/room/<string:room_id>')