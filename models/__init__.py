from app import db
import datetime
import json
import decimal
from sqlalchemy.dialects.mysql import LONGTEXT, TEXT

class User(db.Model):
    
    id = db.Column(db.String(200),primary_key=True)
    email = db.Column(db.String(150),nullable=False)
    username = db.Column(db.String(100),nullable=False)
    gender = db.Column(db.String(10),nullable=False)
    country = db.Column(db.String(100),nullable=False)
    profile_picture_url = db.Column(LONGTEXT())
    password = db.Column(db.String(200),nullable=False)
    created_on = db.Column(db.DateTime,nullable=False)
    sso = db.Column(db.Boolean,nullable=False)
    locked = db.Column(db.Boolean,nullable=True)
    last_passwords = db.Column(db.TEXT(),nullable=True)
    provider = db.Column(db.TEXT(),nullable=True)
    expiry_token = db.Column(db.String(50),nullable=True)
    expiry_date = db.Column(db.DateTime,nullable=True)
    last_login=db.Column(db.DateTime)

    def to_dict(self):
        fields = {}
        for field in [x for x in dir(self) if not x.startswith("_") and x != 'metadata']:
            data = self.__getattribute__(field)
            if type(data) is datetime.datetime:
                data = data.strftime('%Y-%m-%dT%H:%M:%SZ')
            if type(data) is datetime.date:
                data = data.strftime('%Y-%m-%d')
            if not hasattr(data, '__call__'):
                try:
                    json.dumps(data)
                    if field[-4:] == "List" and type(data) is not list:
                        fields[field] = [x for x in data.split(",") if x.strip() != ""]
                    else:
                        fields[field] = data
                except TypeError:
                    if type(data) is decimal.Decimal:
                        fields[field] = float(data)
                    else:
                        fields[field] = None
        return fields