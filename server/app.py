import json
import os
import sqlite3
import sys
from datetime import datetime, timedelta
from functools import wraps
from lib2to3.pgen2 import token
from flask_cors import CORS, cross_origin

import jwt
from flask import Flask, current_app, g, jsonify, make_response, request
from flask.cli import with_appcontext

app = Flask(__name__, instance_relative_config=True)
CORS(app)


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(app.config['DATABASE'], detect_types=sqlite3.PARSE_DECLTYPES)

        def make_dicts(cursor, row):
            return dict((cursor.description[idx][0], value) for (idx, value) in enumerate(row))

        g.db.row_factory = make_dicts
    return g.db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return ((rv[0] if rv else None) if one else rv)


@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


@app.route('/register', methods=['POST'])
def register():

    # validate payload

    if request.json is None:
        return (jsonify(error='Lipseste body'), 400)
    errors = {}
    if 'name' not in request.json:
        errors['name'] = 'Camp obligatoriu'
    if 'password' not in request.json:
        errors['password'] = 'Camp obligatoriu'
    if 'yearsOfStudy' not in request.json:
        errors['yearsOfStudy'] = 'Camp obligatoriu'
    if 'semestersPerYear' not in request.json:
        errors['semestersPerYear'] = 'Camp obligatoriu'
    if errors:
        return (jsonify(errors=errors), 400)

    name = request.json['name']
    password = request.json['password']
    years_of_study = request.json['yearsOfStudy']
    semesters_per_year = request.json['semestersPerYear']
    grades_json = {"years": [{"id": i+1, "semesters": [{"id": j+1, "courses": []} for j in range(2)]} for i in range(3)]}

    # check if user already exists

    db = get_db()
    user = db.execute('SELECT name FROM users where name=?', (name,)).fetchone()
    if user is not None:
        return (jsonify(errors={'name': 'Userul deja exista'}), 400)

    # validate password

    if len(password) < 8:
        return (jsonify(errors={'password': 'Minim 8 caractere'}), 400)

    # hash password

    import os
    from hashlib import pbkdf2_hmac
    salt = os.urandom(32)
    key = pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    hashed_password = salt + key

    # store user in db

    db.cursor().execute('INSERT INTO users(name, password, salt, years_of_study, semesters_per_year, grades_json) VALUES(?, ?, ?, ?, ?, ?)'
                        , (name, hashed_password, salt, years_of_study, semesters_per_year, json.dumps(grades_json)))
    db.commit()

    return (jsonify(message='Creat cu succes'), 201)


@app.route('/login', methods=['POST'])
def login():

    # validate payload

    errors = {}
    if request.json is None:
        return (jsonify(error='Lipseste body'), 400)
    if 'name' not in request.json:
        errors['name'] = 'Camp obligatoriu'
    if 'password' not in request.json:
        errors['password'] = 'Camp obligatoriu'
    if errors:
        return (jsonify(errors=errors), 400)

    name = request.json['name']
    password = request.json['password']

    # get user from db

    user = get_db().execute('SELECT id, name, password, salt FROM users where name=?', (name, )).fetchone()

    if user is None:
        return (jsonify(error='User sau parola incorecte'), 404)

    # hash input password

    from hashlib import pbkdf2_hmac
    salt = user['salt']
    key = pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    hashed_password = salt + key

    if user['password'] != hashed_password:
        return (jsonify(error='User sau parola incorecte'), 404)

    token = jwt.encode({'user': user['id'], 'exp': datetime.utcnow()+ timedelta(minutes=500)}, app.config['SECRET_KEY'])

    response = make_response({'message': 'Autentificat cu succes', 'token': token}, 200)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        try:
            user_info = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])

            kwargs['user_id'] = user_info['user']
        except:
            return jsonify(message='Token de autentificare lipsa sau invalid'), 401

        return f(*args, **kwargs)

    return decorated


@app.route('/getConfigs', methods=['GET'])
def getConfigs():
    configs = get_db() \
        .execute('SELECT user_id, user_name, grades_json FROM configs') \
        .fetchall()

    return (jsonify(configs), 200)


@app.route('/postConfig', methods=['POST'])
@auth_required
def postConfigs(user_id):

    if request.json is None:
        return (jsonify(error='Lipseste body'), 400)
    errors = {}
    if 'faculty_name' not in request.json:
        errors['faculty_name'] = 'Camp obligatoriu'
    if 'domain' not in request.json:
        errors['domain'] = 'Camp obligatoriu'
    if 'grades_json' not in request.json:
        errors['grades_json'] = 'Camp obligatoriu'
    if 'user_name' not in request.json:
        errors['user_name'] = 'Camp obligatoriu'
    if errors:
        return (jsonify(errors=errors), 400)


    faculty_name = request.json['faculty_name']
    domain = request.json['domain']
    grades_json = request.json['grades_json']
    user_name = request.json['user_name']


    configs = get_db().cursor() \
        .execute('INSERT INTO configs (faculty_name, domain, user_id, user_name, grades_json) VALUES(?,?,?,?,?)', (faculty_name, domain, user_id, user_name, grades_json)) \
        .fetchall()

    return (jsonify(configs), 200)


@app.route('/getUserData', methods=['GET'])
@auth_required
def getUserData(user_id):

    user_data = \
        get_db().execute('SELECT grades_json FROM users where id=?',
                         (user_id, )).fetchone()

    return (jsonify(user_data), 200)


@app.route('/getData', methods=['GET'])
@auth_required
def getData(user_id):

    user_data = \
        get_db().execute('SELECT grades_json FROM users where id=?',
                         (user_id, )).fetchone()

    return (jsonify(user_data), 200)


@app.route('/postData', methods=['POST'])
@auth_required
def postData(user_id):

    grades = json.dumps(request.json)

    get_db().cursor() \
        .execute('UPDATE users SET grades_json =? where id=?', (grades, user_id))

    get_db().commit()

    return (jsonify(message='OK'), 200)

if __name__ == '__main__':

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    app.config['DATABASE'] = os.path.join(app.instance_path, 'flask-app.db')
    app.config['SECRET_KEY'] = 'appsecretkey'

    app.run(debug=True, host='0.0.0.0', port=5000)
