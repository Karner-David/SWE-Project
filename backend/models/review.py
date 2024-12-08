from db import db

class Review(db.Model):
    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    review_date = db.Column(db.Date, unique=False, nullable=False)
    review_status = db.Column(db.Enum('PENDING', 'APPROVED', 'DENIED'), unique=False, nullable=False)
    review_text = db.Column(db.String(128), unique=False, nullable=False)
    review_rating = db.Column(db.Integer, unique=False, nullable=False)

    def serialize(self):
        return {
            'review_id': self.review_id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'review_date': self.review_date,
            'review_status': self.review_status,
            'review_text': self.review_text,
            'review_rating': self.review_rating
        }