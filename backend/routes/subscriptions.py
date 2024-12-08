from flask import Blueprint, request
from db import db
from models.user import User
from models.subscription import Subscription
from routes.auth import decode_token
from datetime import date

subscriptions = Blueprint('subscriptions', __name__)

@subscriptions.route('')
def get_subscriptions():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()

    # Remove expired subscriptions
    today = date.today()
    for subscription in user.subscriptions:
        if today >= subscription.end_date:
            db.session.delete(subscription)
    db.session.commit()

    return [subscription.serialize() for subscription in user.subscriptions]

@subscriptions.route('/cancel', methods=['POST'])
def cancel_subscriptions():
    token = decode_token(request.headers['Authorization'])
    user = User.query.filter_by(username=token['username']).first()
    subscription_ids = request.get_json()['subscription_ids']

    total_amount_refunded = 0
    total_points_removed = 0
    for subscription_id in subscription_ids:
        subscription_to_cancel = Subscription.query.get(subscription_id)

        if not subscription_to_cancel.cancellable:
            return f'Subscription {subscription_to_cancel.subscription_id} is not cancellable', 400

        if subscription_to_cancel.user_id != user.user_id:
            return f'Calling user is not subscribed to susbcription {subscription_to_cancel.subscription_id}', 400
    
        # Refund pro-rated percentage of payment and remove percentage of points
        subscription_refund = subscription_to_cancel.calculate_refund_amount()
        if (subscription_to_cancel.product.type == 'MAGAZINE'): # Refund tax for magazines
            subscription_refund *= 1.0825
        total_amount_refunded += subscription_refund
        total_points_removed += subscription_to_cancel.calculate_points_to_remove()

        db.session.delete(subscription_to_cancel)
    
    user.points_accumulated -= total_points_removed
    db.session.commit()

    return {
        'amount_refunded': total_amount_refunded,
        'points_removed': total_points_removed
    }