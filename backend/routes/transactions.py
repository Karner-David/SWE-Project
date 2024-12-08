from flask import Blueprint, request
from models.product import Product
from db import db
from datetime import date
import math
from models.user import User
from models.subscription import Subscription
from routes.auth import decode_token

transactions = Blueprint('transactions', __name__)

@transactions.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()
    product = Product.query.get(request.get_json()['product_id'])

    user.cart.append(product)
    db.session.commit()

    return {'message': 'Product added to cart'}, 200

@transactions.route('/remove-from-cart', methods=['POST'])
def remove_from_cart():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()
    product = Product.query.get(request.get_json()['product_id'])

    user.cart.remove(product)
    db.session.commit()

    return {'message': 'Product removed from cart'}, 200

@transactions.route('/get-cart')
def get_cart():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()

    return [product.serialize() for product in user.cart]

@transactions.route('/checkout', methods=['POST'])
def checkout():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()

    points_spent = request.get_json().get('points_spent', 0)
    if (points_spent > user.points_accumulated):
        return {'message': 'User does not have enough points'}, 400

    total_price = sum(product.price for product in user.cart)
    total_tax = sum(product.price * 0.0825 for product in user.cart if product.type == 'MAGAZINE')
    amount_paid = total_price + total_tax - (points_spent / 100)
    
    points_earned = math.floor(sum(product.price * 0.1 if product.type == 'MAGAZINE' else product.price * 0.2 for product in user.cart) * 100)

    # Process the transaction and add subscriptions to database
    start_date = date.today()
    end_date = date(start_date.year + 1, start_date.month, start_date.day)
    for product in user.cart:
        new_subscription = Subscription(
            product_id = product.product_id,
            transaction_id = 1,
            cancellable = (points_spent == 0),
            start_date = start_date,
            end_date = end_date,
        )
        user.subscriptions.append(new_subscription)

    # Update the user object
    user.points_accumulated -= points_spent
    user.points_accumulated += points_earned
    user.cart.clear()
    db.session.commit()

    return {
        'message': 'Checked out successfully',
        'points_earned': points_earned
    }, 200