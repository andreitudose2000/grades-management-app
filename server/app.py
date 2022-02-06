import json
import os
import sqlite3
import sys
from datetime import datetime, timedelta
from functools import wraps
from lib2to3.pgen2 import token
from flask_cors import CORS

import jwt
from flask import Flask, current_app, g, jsonify, make_response, request
from flask.cli import with_appcontext

app = Flask(__name__, instance_relative_config=True)
CORS(app)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            app.config['DATABASE'], 
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        def make_dicts(cursor, row):
            return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))

        g.db.row_factory = make_dicts
    return g.db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


@app.route('/register', methods=['POST'])
def register():
    # validate payload
    if request.json is None:
        return jsonify(error='Lipseste body'), 400
    errors = {}
    if 'name' not in request.json:
        errors['name']= 'Camp obligatoriu'
    if 'password' not in request.json:
        errors['password'] = 'Camp obligatoriu'
    if errors:
        return jsonify(errors=errors), 400
    
    name = request.json['name']
    password = request.json['password']

    # check if user already exists
    db = get_db()
    user = db \
        .execute('SELECT name FROM users where name=?',(name,)) \
        .fetchone()
    if user is not None:
        return jsonify(errors={'name': 'Userul deja exista'}), 400

    # validate password
    if len(password) < 8:
        return jsonify(errors={'password': 'Minim 8 caractere'}), 400

    # hash password
    import os
    from hashlib import pbkdf2_hmac
    salt = os.urandom(32)
    key = pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    hashed_password = salt + key 
    
    # store user in db
    db.cursor().execute(
        'INSERT INTO users(name, password, salt, grades_json) VALUES(?, ?, ?, ?)',
        (name, hashed_password, salt, json.dumps({}))
        )
    db.commit()
    
    return jsonify(message='Creat cu succes'), 201


@app.route('/login', methods=['POST'])
def login():
    # validate payload
    errors = {}
    if request.json is None:
        return jsonify(error='Lipseste body'), 400
    if 'name' not in request.json:
        errors['name']= 'Camp obligatoriu'
    if 'password' not in request.json:
        errors['password'] = 'Camp obligatoriu'
    if errors:
        return jsonify(errors=errors), 400
    
    name = request.json['name']
    password = request.json['password']

    # get user from db
    user = get_db() \
        .execute('SELECT id, name, password, salt FROM users where name=?',(name,)) \
        .fetchone()

    if user is None:
        return jsonify(error='User sau parola incorecte'), 404

    # hash input password
    from hashlib import pbkdf2_hmac
    salt = user['salt']
    key = pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    hashed_password = salt + key 

    if user['password'] != hashed_password:
        return jsonify(error='User sau parola incorecte'), 404

    token = jwt.encode(
        {'user': user['id'], 'exp': datetime.utcnow() + timedelta(minutes=30)}, 
        app.config['SECRET_KEY'])

    response = make_response({'message': 'Autentificat cu succes', 'token': token}, 200)
    return response


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers["Authentication"]
        print("token: ")
        print(token)

        try:
            user_info = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print(user_info)
            kwargs['userId'] = user_info['user']
        except:
            return jsonify(message='Token de autentificare lipsa sau invalid'), 401

        return f(*args, **kwargs)
    
    return decorated


@app.route('/getData', methods=['GET'])
@auth_required
def getData(userId):
    
    print(userId, file=sys.stderr)
    user_data = get_db() \
        .execute('SELECT grades_json FROM users where id=?',(userId,)) \
        .fetchone()

    print(user_data)
    return jsonify(user_data), 200

@app.route('/postData', methods=['POST'])
@auth_required
def postData(userId):
    
    grades = json.dumps(request.json)

    print(type(request.json), file=sys.stderr)

    get_db().cursor() \
        .execute('UPDATE users SET grades_json =? where id=?',(grades, userId)) 

    get_db().commit()

    return jsonify(message="OK"), 200

if __name__ == '__main__':
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    app.config['DATABASE'] = os.path.join(app.instance_path, 'flask-app.db')
    app.config['SECRET_KEY'] = 'appsecretkey'
    
    app.run(debug=True, host='0.0.0.0', port=5000)
