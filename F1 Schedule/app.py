from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os

app = Flask(__name__)

CORS(app, resources={r"/get_slideshow_images": {"origins": "http://localhost:58186"}, 
                     r"/get_event_thumbnails": {"origins": "http://localhost:58186"},
                     r"/get_event_details": {"origins": "http://localhost:58186"},
                     r"/get_drivers/*": {"origins": "http://localhost:58186"},
                     r"/login": {"origins": "http://localhost:58186"},
                     r"/signup": {"origins": "http://localhost:58186"}
})

load_dotenv()

db = mysql.connector.connect(
    host='localhost',
    user='root',
    password=os.getenv('DB_PASSWORD'),
    database='f1 schedule'
)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email_address = data['emailAddress']
    password = data['password']

    db = mysql.connector.connect(
    host='localhost',
    user='root',
    password=os.getenv('DB_PASSWORD'),
    database='f1 schedule'
    )

    cursor = db.cursor()

    cursor.execute(f"SELECT COUNT(*) FROM users \
                     WHERE email = '{email_address}' AND password = SHA('{password}');")

    count = cursor.fetchone()
    
    if int(count[0]) == 1:
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
    host='localhost',
    user='root',
    password=os.getenv('DB_PASSWORD'),
    database='f1 schedule'
    ) 

    cursor = db.cursor()

    cursor.execute(f"INSERT INTO users (fname, lname, email, password) \
                     VALUES ('{first_name}', '{last_name}', '{email_address}', SHA('{password}'))")
    
    response = {'message': 'User created successfully!'}

    db.commit()
    cursor.close()
    db.close()

    return jsonify(response)


@app.route('/get_slideshow_images', methods=['GET'])
def get_slideshow_images():

    cursor = db.cursor()

    cursor.execute("SELECT image_source FROM slideshow WHERE priority = 1 ORDER BY RAND()")
    img1 = cursor.fetchall()

    cursor.execute("SELECT image_source FROM slideshow WHERE priority = 2 ORDER BY RAND()")
    img2 = cursor.fetchall()

    cursor.execute("SELECT image_source FROM slideshow WHERE priority = 3 ORDER BY RAND()")
    img3 = cursor.fetchall()

    cursor.close()

    return jsonify([img1, img2, img3])

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
        host='localhost',
        user='root',
        password=os.getenv('DB_PASSWORD'),
        database='f1 schedule'
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


if __name__ == '__main__':
    app.run(debug=True)

    db.close()