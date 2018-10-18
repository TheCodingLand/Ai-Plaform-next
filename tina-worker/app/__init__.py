from pymongo import MongoClient
import os, logging
import yaml

with open("../config.yml", 'r') as ymlfile:
    try:
        cfg = yaml.load(ymlfile)
    except FileNotFoundError:
        logging.error("please mount a yaml configuration file for the mongoDB Database at ./config.yml")

try: 
    USER = cfg['mongo']['user']
except KeyError:
    logging.error("key [mongo][user] not found in yaml configuration file")

try: 
    USER = cfg['mongo']['password']
except KeyError:
    logging.error("key [mongo][password] not found in yaml configuration file")


PASSWORD = cfg['mongo']['password']

mongohost = os.environ.get('MONGODB_SERVER')
try:
    client = MongoClient(mongohost, 27017,username=USER, password=PASSWORD)
except:
    logging.error('connexion failed')
    raise
