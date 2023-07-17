from flask import Flask, jsonify, request, render_template, request, redirect, url_for, session
from flask_session import Session
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
from time import sleep
import secrets
import time
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16) 
app.config['SESSION_TYPE'] = 'filesystem'  
Session(app)


CORS(app, resources={r"/get_slideshow_images": {"origins": "https://f1-schedule-2023.onrender.com"}, 
                     r"/get_event_thumbnails": {"origins": "https://f1-schedule-2023.onrender.com"},
                     r"/get_event_details": {"origins": "https://f1-schedule-2023.onrender.com"},
                     r"/get_drivers/*": {"origins": "https://f1-schedule-2023.onrender.com"},
                     r"/login": {"origins": "https://f1-schedule-2023.onrender.com"},
                     r"/signup": {"origins": "https://f1-schedule-2023.onrender.com"},
                     r"/logout": {"origins": "https://f1-schedule-2023.onrender.com"},
                     r"/index": {"origins": "https://f1-schedule-2023.onrender.com"}
})

load_dotenv()

db = mysql.connector.connect(
    host=os.getenv('HOST'),
    user=os.getenv('USER'),
    password=os.getenv('PASSWORD'),
    database=os.getenv('DATABASE')
)

@app.before_request
def check_session_expiry():
    last_activity = session.get('last_activity')
    if last_activity:
        current_timestamp = int(time.time())
        if (current_timestamp - last_activity) >= 600:  
            session.clear()
    session['last_activity'] = int(time.time())

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email_address = data['emailAddress']
    password = data['password']

    db = mysql.connector.connect(
        host=os.getenv('HOST'),
        user=os.getenv('USER'),
        password=os.getenv('PASSWORD'),
        database=os.getenv('DATABASE')
    )

    cursor = db.cursor()

    cursor.execute(f"SELECT COUNT(*) FROM users \
                     WHERE email = '{email_address}' AND password = SHA('{password}');")

    count = cursor.fetchone()
    
    if int(count[0]) == 1:
        session['user_id'] = 1
        session['last_activity'] = int(time.time())
        response = {'message': 1}
    else:
        response = {'message': 0}

    cursor.close()
    db.close()

    return jsonify(response)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    first_name = data['firstName']
    last_name = data['lastName']
    email_address = data['emailAddress']
    password = data['password']
    confirm_password = data['confirmPassword']

    db = mysql.connector.connect(
        host=os.getenv('HOST'),
        user=os.getenv('USER'),
        password=os.getenv('PASSWORD'),
        database=os.getenv('DATABASE')
    ) 

    cursor = db.cursor()

    cursor.execute(f'SELECT COUNT(*) FROM users WHERE email = {email_address}')
    cursor.fetchone()

    if int(count[0]) == 1:
        response = {'message': 1}
    else:
        cursor.execute(f"INSERT INTO users (fname, lname, email, password) \
                         VALUES ('{first_name}', '{last_name}', '{email_address}', SHA('{password}'))")
        response = {'message': 'User created successfully!'}
        db.commit()

    cursor.close()
    db.close()

    return jsonify(response)


@app.route('/logout')
def logout():
    session.clear()  
    return render_template('login.html')



@app.route('/index')
def index():
    if 'user_id' not in session:
        return render_template('login.html')
    return render_template('index.html')


@app.route('/get_slideshow_images', methods=['GET'])
def get_slideshow_images():
    max_retries = 3
    retry_delay = 1 

    for _ in range(max_retries):
        try:
            with db.cursor() as cursor:
                cursor.execute("SELECT image_source FROM slideshow WHERE priority = 1 ORDER BY RAND()")
                img1 = cursor.fetchone()

                cursor.execute("SELECT image_source FROM slideshow WHERE priority = 2 ORDER BY RAND()")
                img2 = cursor.fetchone()

                cursor.execute("SELECT image_source FROM slideshow WHERE priority = 3 ORDER BY RAND()")
                img3 = cursor.fetchone()

            return jsonify([img1, img2, img3])

        except Exception as e:
            print(f"Error in get_slideshow_images: {e}")
            sleep(retry_delay)

    abort(500) 

@app.route('/get_event_thumbnails', methods=['GET'])
def get_event_thumbnails():

    cursor = db.cursor()

    cursor.execute("SELECT title, date, location, image_source FROM event;")

    data = cursor.fetchall()

    cursor.close()

    return jsonify(data)

@app.route('/get_event_details', methods=['GET'])
def get_event_details():

    cursor = db.cursor()

    cursor.execute("SELECT * FROM event;")

    data = cursor.fetchall()

    cursor.close()

    return jsonify(data)

@app.route('/get_drivers/<int:event>', methods=['GET'])
def get_drivers(event):
    db = mysql.connector.connect(
        host=os.getenv('HOST'),
        user=os.getenv('USER'),
        password=os.getenv('PASSWORD'),
        database=os.getenv('DATABASE')
    )

    cursor = db.cursor()

    cursor.execute(f"SELECT d.name, n.nation, n.flag_source, t.name, t.logo_source, p.points \
                    FROM drivers AS d, nationality AS n, team AS t, points AS p \
                    WHERE d.nationality_id = n.id AND d.team_id = t.id AND p.driver_id = d.id AND p.event_id = {event+1} \
                    ORDER BY p.points DESC;"
    )

    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)

@app.route('/')
def root():
    return render_template('login.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

    db.close()