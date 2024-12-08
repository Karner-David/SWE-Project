from db import db
from models.product import Product
from models.review import Review
from models.subscription import Subscription

# Association table of cart to products
# Each row contains one user and one item that is in their cart
cart_items = db.Table('CartItems',
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('product.product_id'), primary_key=True)
)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(64))
    middle_initial = db.Column(db.String(1))
    surname = db.Column(db.String(64))
    mailing_address = db.Column(db.String(128))
    email_address = db.Column(db.String(64))
    username = db.Column(db.String(64))
    password = db.Column(db.String(64))
    role = db.Column(db.Enum('READER', 'PUBLISHER', 'ADMIN'))

    # Reader-specific fields
    cart = db.relationship('Product', secondary=cart_items) # many-to-many
    subscriptions = db.relationship('Subscription') # one-to-many
    reviews = db.relationship('Review') # one-to-many
    # product_history = db.Column(db.Array(Product))
    default_credit_card = db.Column(db.String(256))
    points_accumulated = db.Column(db.Integer, default=0)

    # Publisher-specific fields
    published_products = db.relationship('Product') # one-to-many

    # Admin-specific fields

    def serialize(self): # all reader fields except for password
        return {
            'user_id': self.user_id,
            'first_name': self.first_name,
            'middle_initial': self.middle_initial,
            'surname': self.surname,
            'mailing_address': self.mailing_address,
            'email_address': self.email_address,
            'username': self.username,
            'default_credit_card': self.default_credit_card,
            'points_accumulated': self.points_accumulated,
        }
