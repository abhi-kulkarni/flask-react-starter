from app import app, db
from sqlalchemy import func
from werkzeug.security import check_password_hash, generate_password_hash
import flask
import datetime



# @app.route('/api/userManagementData', methods=['GET'])
# def userManagementData():
#     from models import User
#     from app import db

#     user=[k.to_dict() for k in db.session.query(User).all()]

#     return flask.jsonify(ok=True, users=user)


@app.route('/signup', methods=['POST'])
def signup():
    from models import User
    import uuid
    
    post_data = flask.request.json.get("post_data", "")
    user = User()
    user.id = str(uuid.uuid4())
    user.password = generate_password_hash(post_data.get("password", ""), salt_length=8)
    user.created_on = datetime.datetime.now()
    user.username = post_data.get("username", "")
    user.email = post_data.get("email", "")
    user.sso = post_data.get("sso", "")
    user.country = post_data.get("country", "")
    user.gender = post_data.get("gender", "")
    user.profile_picture_url = post_data.get("profile_picture_url", "")
    db.session.add(user)
    db.session.commit()
    return flask.jsonify(ok=True, msg="success")


# @app.route('/api/delete_user/<int:userId>',methods=['DELETE'])
# # @requires_auth('admin','manager')
# def delete_user(userId):
#     from models import User
#     from app import db
#     user=User.query.get(userId)
#     db.session.delete(user)
#     db.session.commit()
#     return flask.jsonify(ok=True)


# @app.route('/api/getUserData/<int:userId>', methods=['GET'])
# # @requires_auth('admin','manager')
# def getUserData(userId):
#     from models import User
#     from app import db
#     user=User.query.get(userId)
#     user_data = user.to_dict()
#     del user_data['password']
#     return flask.jsonify(ok=True, user_data=user_data)


# @app.route('/api/edit_user', methods=['POST'])
# # @requires_auth('admin','manager')
# def edit_user():
#     from app import db
#     from models import User
#     user = User.query.get(flask.request.json.get('id', ''))
#     user.role = flask.request.json.get('privilege', '')
#     user.firstName = flask.request.json.get('firstName', '')
#     user.lastName = flask.request.json.get('lastName', '')
#     user.email = flask.request.json.get('email', '')
#     db.session.add(user)
#     db.session.commit()
#     return flask.jsonify(ok=True)