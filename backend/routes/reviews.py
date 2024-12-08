from flask import Blueprint, request
from db import db
from datetime import date
from models.review import Review
from models.product import Product
from models.user import User
from routes.auth import decode_token
from routes.products import update_product_rating

reviews = Blueprint('reviews', __name__)

@reviews.route('/product/<int:product_id>')
def get_product_reviews(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return 'Product not found', 404
    return [review.serialize() for review in product.reviews if review.review_status == 'APPROVED']

@reviews.route('/get-user-reviews')
def get_user_reviews():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()

    return [review.serialize() for review in user.reviews]

@reviews.route('/leave-review', methods=['POST'])
def leave_review():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()
    product = Product.query.get(request.get_json()['product_id'])

    review = Review(
        review_text = request.get_json()['review_text'],
        review_rating = request.get_json()['review_rating'],
        review_date = date.today(),
        review_status = 'PENDING'
    )
    product.reviews.append(review)
    user.reviews.append(review)
    db.session.commit()

    return 'Review successfully added', 200

@reviews.route('/get-pending-reviews')
def get_pending_reviews():
    token = decode_token(request.headers['Authorization'])
    if token['role'] != 'ADMIN': # Can only be called by an admin
        return 'Unauthorized user', 403
    
    pending_reviews = Review.query.filter_by(review_status='PENDING').all()
    return [review.serialize() for review in pending_reviews]

@reviews.route('/approve-review', methods=['POST'])
def approve_review():
    token = decode_token(request.headers['Authorization'])
    if token['role'] != 'ADMIN': # Can only be called by an admin
        return 'Unauthorized user', 403
    
    review = Review.query.get(request.get_json()['review_id'])
    review.review_status = 'APPROVED'
    db.session.commit()

    # TODO: update product rating based on newly approved review?
    update_product_rating(review.product_id)

    return 'Review successfully approved', 200

@reviews.route('/deny-review', methods=['POST'])
def deny_review():
    token = decode_token(request.headers['Authorization'])
    if token['role'] != 'ADMIN': # Can only be called by an admin
        return 'Unauthorized user', 403
    
    review = Review.query.get(request.get_json()['review_id'])
    review.review_status = 'DENIED'
    db.session.commit()

    return 'Review successfully denied', 200