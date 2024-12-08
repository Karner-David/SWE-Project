from db import db
from models.product import Product

class Transaction():
    transaction_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    product_ids = db.relationship('Product')
    amount = db.Column(db.Float)
    pay_with_points_dollar_amount = db.Column(db.Float)
    payment_date = db.Column(db.Date)
    payment_status = db.Column(db.Enum('SUCCESSFUL', 'FAILED', 'PENDING'))
    used_points = db.Column(db.Integer)
    credit_card_info = db.Column(db.String(256))

# We might not even need this class