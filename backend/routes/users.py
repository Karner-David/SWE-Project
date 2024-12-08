from flask import Blueprint, request
from db import db
from models.user import User
from routes.auth import decode_token, hash_password

users = Blueprint('users', __name__)

# Only works for readers

@users.route('/get-profile')
def get_profile():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()

    return user.serialize()

@users.route('/update-profile', methods=['POST'])
def update_profile():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()

    user.first_name = request.get_json()['first_name']
    user.middle_initial = request.get_json()['middle_initial']
    user.surname = request.get_json()['surname']
    user.mailing_address = request.get_json()['mailing_address']
    user.email_address = request.get_json()['email_address']
    user.default_credit_card = request.get_json()['default_credit_card']

    new_password = request.get_json().get('password')
    if (new_password is not None): # User updated their password
        user.password = hash_password(new_password)

    db.session.commit()

    return {'message': 'Successfully updated profile'}, 200