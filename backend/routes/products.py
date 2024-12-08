from flask import Blueprint, request
from db import db
from models.product import Product
from models.review import Review
from models.user import User
from routes.auth import decode_token

products = Blueprint('products', __name__)

@products.route('/upload', methods=['POST'])
def upload():
    token = decode_token(request.headers['Authorization'])

    new_product = Product(
        title = request.get_json()['title'],
        description = request.get_json()['description'],
        price = request.get_json()['price'],
        cover = request.get_json()['cover'],
        type = request.get_json()['type'],
        issue_frequency = request.get_json().get('issue_frequency', 365),
        city = request.get_json().get('city', None),
        rating = 0 # No ratings yet
    )
    publisher = User.query.filter_by(username=token['username']).first()
    publisher.published_products.append(new_product)
    db.session.commit()

    return {'message': 'Product uploaded successfully'}, 200

@products.route('/get')
def get():
    type = request.args.get('type')
    sortby = request.args.get('sortby')
    orderby = request.args.get('orderby', 'ascending') # Ascending or descending order
    offset = request.args.get('offset', 0)
    count = request.args.get('count', 50)
    search_pattern = '%' + request.args.get('search', '') + '%'

    sortby_column = None
    if sortby == 'title':
        sortby_column = Product.title
    elif sortby == 'price':
        sortby_column = Product.price
    elif sortby == 'issues':
        sortby_column = Product.issue_frequency
    elif sortby == 'city':
        sortby_column = Product.city

    if sortby_column is not None:
        sortby_column = sortby_column.desc() if orderby == 'descending' else sortby_column.asc()

    products = Product.query.filter(
        Product.type == type,
        Product.title.ilike(search_pattern),
    ).order_by(sortby_column).offset(offset).limit(count).all()
    
    return [product.serialize() for product in products]

@products.route('/<int:product_id>')
def get_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return 'Product not found', 404
    return product.serialize()

def update_product_rating(product_id):
    product = Product.query.get(product_id)
    reviews = Review.query.filter_by(product_id=product_id).all()
    if product is None or reviews is None:
        return 'Product not found', 404
    # TODO: Is this inefficient? Store curr rating (already done) and curr num
    # of approved ratings to simply update based on the one new review?
    approved_reviews = [review.review_rating for review in reviews if review.review_status == 'APPROVED']
    product.rating = sum(approved_reviews) / len(approved_reviews) if approved_reviews else 0
    db.session.commit()
