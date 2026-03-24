from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from models import db, User
import os

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Change this in production
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


def create_token(email):
    payload = {
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    if not email or not password or not first_name:
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 409
    hashed_password = generate_password_hash(password)
    user = User(email=email, password=hashed_password, first_name=first_name, last_name=last_name)
    db.session.add(user)
    db.session.commit()
    token = create_token(email)
    return jsonify({'message': 'Account created successfully', 'token': token}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401
    token = create_token(email)
    return jsonify({'message': 'Login successful', 'token': token}), 200

@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token missing'}), 401
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['email']
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'email': email, 'first_name': user.first_name, 'last_name': user.last_name}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
