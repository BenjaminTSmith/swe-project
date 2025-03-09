import firebase_admin
from firebase_admin import credentials, auth

# TODO: actually add authentication to app
cred = credentials.Certificate("TODO: path to our credentials json");
firebase_admin.initialize_app(cred)
