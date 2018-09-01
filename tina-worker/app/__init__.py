from pymongo import MongoClient
import os
mongohost = os.environ.get('MONGODB_SERVER')
client = MongoClient(mongohost, 27017,username='root', password='example')