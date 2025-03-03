from flask import Flask
from flask_cors import CORS
from flaskext.mysql import MySQL
import time

app = Flask(__name__)
CORS(app) # allows cross origin communication with React

# MySQL Database Connection
mysql = MySQL(app, user="", password="", db="") # TODO: James or Oliver add mySQL settings or change db

# test request
@app.route("/time")
def get_time():
    return { "time": time.time() }


@app.route("/tutors")
def get_tutors():
    return {}
