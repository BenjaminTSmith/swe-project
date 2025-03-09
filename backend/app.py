from flask import Flask, request, jsonify
from flask_cors import CORS
from flaskext.mysql import MySQL

app = Flask(__name__)
CORS(app) # allows cross origin communication with React

# MySQL Database Connection
mysql = MySQL(app, user="", password="", db="") # TODO: James or Oliver add mySQL settings or change db

# test request
@app.route("/time", methods=["POST"])
def time():
    data = request.json
    time = data.get("time", "No time sent");
    print(time)
    return jsonify({ "response": "Time received" })


@app.route("/tutors")
def get_tutors():
    return {}
