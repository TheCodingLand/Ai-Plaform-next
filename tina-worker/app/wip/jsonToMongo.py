

import json
from pymongo import MongoClient

username = 'root'
password = 'example'

client = MongoClient('mongodb://%s:%s@tina-mongodb' % (username, password),27017)
db = client['rawdata']
collection_rawdata = db['bnp']

with open(r'C:\\Users\\jlebourg\\Projects\\Data\\output.json') as f:
    file_data = json.load(f)

collection_rawdata.insert_many(file_data)
client.close()
