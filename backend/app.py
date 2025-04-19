from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os
import random

app = Flask(__name__)
CORS(app) # allows communication with React

app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_DEFAULT_SENDER=os.getenv("MAIL_DEFAULT_SENDER"),
)
mail = Mail(app)

@app.route("/send_verification_email", methods=["POST"])
def send_verification_email():
    data = request.get_json()
    user_email = data.get("email")

    verification_code = f"{random.randint(000000, 999999):06d}"

    message = Message(
        subject="Your Verification Code",
        recipients=[user_email],
        body=(
            f"Hello,\n\n"
            f"Your verification code for Tutors4UF is: {verification_code}\n\n"
        )
    )
    try:
        mail.send(message)
    except Exception as e:
        return jsonify({ "error": "Failed to send email" }), 500

    return jsonify({ "code": verification_code }), 200
