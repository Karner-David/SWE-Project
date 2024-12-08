from db import db
from models.review import Review

class Product(db.Model):
    product_id = db.Column(db.Integer, primary_key=True)
    publisher_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    title = db.Column(db.String(128))
    description = db.Column(db.String(1024))
    price = db.Column(db.Float)
    reviews = db.relationship('Review')
    rating = db.Column(db.Float) # Average rating from all reviews
    cover = db.Column(db.String(512)) # path to an image src
    type = db.Column(db.Enum('MAGAZINE', 'NEWSPAPER'))

    # Magazine-specific fields
    issue_frequency = db.Column(db.Integer)

    # Newspaper-specific fields
    city = db.Column(db.String(64))

    def serialize(self):
        return {
            'product_id': self.product_id,
            'publisher_id': self.publisher_id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'rating': self.rating,
            'cover': self.cover,
            'type': self.type,
            'issues': self.issue_frequency,
            'city': self.city,
        }