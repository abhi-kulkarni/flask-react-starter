from flask import Flask, render_template, request
import flask
from sqlalchemy import func
from flask_cors import CORS
from decimal import Decimal
from werkzeug.security import check_password_hash, generate_password_hash
import json
from flask_sqlalchemy import SQLAlchemy
import datetime
from functools import wraps
import sqlalchemy
import jwt


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        self.encoding = 'latin-1'
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


app = Flask(__name__)

app.json_encoder = DecimalEncoder

app.config.from_pyfile('config.py')

db = SQLAlchemy(app)

db.init_app(app)

cors = CORS(app, allow_headers=[
    "Content-Type", "Authorization", "Access-Control-Allow-Credentials", "withCredentials"],
            supports_credentials=True, resources={r"/*": {"origins": "*"}})


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try: 
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return flask.jsonify({'message' : 'Token is invalid!'}), 401

        return f(*args, **kwargs)

    return decorated

def unauthorized_abort():
    if flask.request.is_xhr:
        return flask.abort(401)
    else:
        return flask.redirect(flask.url_for("user.login"))

@app.route("/hello", methods=["GET"])
def hello():

    return render_template("hello_world.html")

    
@app.route("/login", methods=["GET", "POST"])
def login():
    from models import User
    if flask.request.method == "POST" and "email" in flask.request.json["post_data"] and "password" in flask.request.json["post_data"]:
        user_data = db.session.query(User).filter(func.lower(flask.request.json["post_data"]["email"]) == func.lower(User.email)).all()
        print(user_data)
        if len(user_data) != 0:
            user = user_data[0]
            if check_password_hash(user.password, flask.request.json["post_data"]["password"]):
                flask.session["user_id"] = user.id
                flask.session["user_email"] = user.email
                flask.session["username"] = user.username

            access_token = jwt.encode({"user_email":user.email, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config["SECRET_KEY"])
                        
            # For Redux
            temp_dict = dict()
            temp_dict["userId"] = user.id
            temp_dict["userEmail"] = user.email
            temp_dict["userName"] = user.username
            temp_dict["isLoggedIn"] = True

            return flask.jsonify(ok=True, user_data=temp_dict, token=access_token.decode("UTF-8"))
        else:
            return flask.jsonify(ok=False, error="No such user or incorrect password")
    return flask.jsonify(ok=False, error='')


@app.route("/get_authenticated_user_information")
def get_authenticated_user_information():
    if "user_id" in flask.session and flask.session["user_id"]:
        from models import User
        user = db.session.query(User).get(flask.session["user_id"])

        temp_dict = dict()
        temp_dict["userId"] = user.id
        temp_dict["userEmail"] = user.email
        temp_dict["userName"] = user.username
        temp_dict["isLoggedIn"] = True

        flask.session["user_id"] = user.id
        flask.session["user_email"] = user.email
        flask.session["username"] = user.username

        return flask.jsonify(ok=True, user_data=temp_dict, is_logged_in=True)
    else:
        return flask.jsonify(ok=False,is_logged_in=False)


@app.route("/get_user_data/<string:user_id>/", methods=["GET"])
@token_required
def get_user_data(user_id):
    from models import User

    user = db.session.query(User).filter(User.id == user_id).first()
    if user:
        return flask.jsonify(ok=True, user=user.to_dict())
    else:
        return flask.jsonify(ok=False)


@app.route("/get_all_users/", methods=["GET"])
@token_required
def get_all_users():
    from models import User

    users = [k.to_dict() for k in db.session.query(User).all()]
    if users:
        return flask.jsonify(ok=True, users=users)
    else:
        return flask.jsonify(ok=False)


@app.route("/change_password", methods=["POST"])
@token_required
def change_password():
    from models import User
    user = User.query.get(flask.session["user_id"])
    error = ""
    msg = ""
    if check_password_hash(user.password, flask.request.json.get("currentPassword","")):
        if len(flask.request.json.get("newPassword","")) >= 8:
            if flask.request.json.get("newPassword","") == flask.request.json.get("confirmPassword",""):
                user.password = generate_password_hash(flask.request.json.get("newPassword",""), salt_length=8)
                db.session.commit()
                msg = "Password is changed successfully. Please sign-in with new password."
            else:
                error = "Does not match new password."
        else:
            error = "Password length should be atleast 6 character."
    else:
        error = "Current Password is wrong."

    return flask.jsonify(ok=True, error=error, msg=msg)


@app.route("/logout/", methods= ["GET"])
def logout():
    if "user_id" in flask.session:
        flask.session.clear()
    return flask.jsonify(ok=True)


from admin_views import *

if __name__ == '__main__':
    app.run()
