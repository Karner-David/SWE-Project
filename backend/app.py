from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from db import db
from models.product import Product
from models.review import Review
from models.subscription import Subscription
from models.transaction import Transaction
from models.user import User
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///subscriptions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
CORS(app)

with app.app_context():
    db.create_all()

from routes.auth import auth
from routes.products import products
from routes.transactions import transactions
from routes.users import users
from routes.reviews import reviews
from routes.subscriptions import subscriptions
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(products, url_prefix='/products')
app.register_blueprint(transactions)
app.register_blueprint(users, url_prefix='/users')
app.register_blueprint(reviews, url_prefix='/reviews')
app.register_blueprint(subscriptions, url_prefix='/subscriptions')

@app.route("/test")
def test():
    # Use for testing logic and syntax
    return "Hello world!"

if __name__ == '__main__':
    app.run(debug=True)