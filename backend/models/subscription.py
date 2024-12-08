from db import db
from models.product import Product
from datetime import date
import math

class Subscription(db.Model):
    subscription_id = db.Column(db.Integer, primary_key=True)   
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    product = db.relationship('Product', uselist=False)
    transaction_id = db.Column(db.Integer, unique=False, nullable=False)
    cancellable = db.Column(db.Boolean, unique=False, nullable=False)
    start_date = db.Column(db.Date, unique=False, nullable=False)
    end_date = db.Column(db.Date, unique=False, nullable=False)

    def serialize(self):
        return {
            'subscription_id': self.subscription_id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'transaction_id': self.transaction_id,
            'cancellable': self.cancellable,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'amount_to_refund': self.calculate_refund_amount(),
        }

    def calculate_refund_percentage(self):
        days_between_issues = 365 / self.product.issue_frequency
        days_passed = (date.today() - self.start_date).days
        issues_received = days_passed // days_between_issues
        return 1 - (issues_received / self.product.issue_frequency)
    
    # Not-including tax
    def calculate_refund_amount(self):
        total_price = self.product.price
        return total_price * self.calculate_refund_percentage()

    def calculate_points_to_remove(self):
        points_earned = (self.product.price * 0.1 if self.product.type == 'MAGAZINE' else self.product.price * 0.2) * 100
        return math.floor(points_earned * self.calculate_refund_percentage())
