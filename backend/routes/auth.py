from flask import Blueprint, request
import jwt
import bcrypt
from db import db
from models.user import User

auth = Blueprint('auth', __name__)

@auth.route('/sign-up', methods=['POST'])
def sign_up():
    # If email or username already exists, error
    if get_user_by_email(request.get_json()['email']) is not None:
        return {'message': 'Email already exists'}, 400

    if get_user_by_username(request.get_json()['username']) is not None:
        return {'message': 'Username is taken'}, 400

    # Create Reader object with hashed password, add to DB
    hashed_password = hash_password(request.get_json()['password'])
    new_user = User(
        first_name = request.get_json()['first_name'],
        middle_initial = request.get_json()['middle_initial'],
        surname = request.get_json()['surname'],
        mailing_address = request.get_json()['address'],
        email_address = request.get_json()['email'],
        username = request.get_json()['username'],
        password = hashed_password,
        role = 'READER',
        default_credit_card = request.get_json()['default_credit_card'],
    )
    db.session.add(new_user)
    db.session.commit()

    # Create JWT
    token = jwt.encode({
        'username': new_user.username,
        'role': new_user.role,
    }, '01134')

    return {'token': token, 'message': 'Account successfully created'}

@auth.route('/log-in', methods=['POST'])
def log_in():
    user = get_user_by_username(request.get_json()['username'])

    # If user doesn't exist in DB, error
    if user is None:
        return {'message': 'User does not exist'}, 400

    # Check if given password matches
    if not bcrypt.checkpw(request.get_json()['password'].encode('utf-8'), user.password):
        return {'message': 'Incorrect password'}, 400
    
    # Create JWT
    token = jwt.encode({
        'username': user.username,
        'role': user.role,
    }, '01134')

    return {'token': token,'message': 'Login successful'}

def get_user_by_username(username):
    return User.query.filter_by(username=username).first()

def get_user_by_email(email):
    return User.query.filter_by(email_address=email).first()

def hash_password(password_plaintext):
    return bcrypt.hashpw(password_plaintext.encode('utf-8'), bcrypt.gensalt())

def decode_token(token):
    return jwt.decode(token, '01134', algorithms=['HS256'])