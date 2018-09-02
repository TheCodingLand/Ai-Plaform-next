# manage.py
# this initializes the flask app to prepare the api configuration and logging
import unittest

import os
from flask import Flask, jsonify, Blueprint
from werkzeug.contrib.fixers import ProxyFix
from flask import Flask

import ft

from ft.restplus import api

from flask_pymongo import PyMongo

from flask_cors import CORS

from flask_script import Manager



import logging

logger = logging.getLogger('werkzeug')
logger.setLevel(logging.DEBUG)

# create a file handler
handler = logging.FileHandler('/data/logs/logs.log')
handler.setLevel(logging.DEBUG)

# create a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# add the handlers to the logger
logger.addHandler(handler)



app = Flask('ft')
app.config["MONGO_URI"] = "mongodb://root:example@tina-mongodb:27017/rawdata"
ft.db = PyMongo(app)
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app)

blueprint = Blueprint('api', __name__)
# instantiate the app
api.init_app(blueprint)

# set config
app_settings = os.getenv('APP_SETTINGS')
app.config.from_object(app_settings)
# register namespace

api.add_namespace(ft.ftcommands)
api.add_namespace(ft.mongoviews)
app.register_blueprint(blueprint)


manager = Manager(app)


if __name__ == '__main__':
    manager.run()