import json
import re
from bs4 import BeautifulSoup
import os
import time
from pymongo import MongoClient
USER = os.environ.get('ME_CONFIG_BASICAUTH_USERNAME')
PASS = os.environ.get('ME_CONFIG_BASICAUTH_PASSWORD')
MONGODB_SERVER = os.environ.get('MONGODB_SERVER')
from app import client
#client = MongoClient('mongodb://%s:%s@%s' % (USER, PASS, MONGODB_SERVER),27017)
# client = MongoClient('mongodb://%s:%s@tina.ctg.lu' % (username, password),27017) #if you open mongo port, you can run this from outside the docker env. not recommended, good for debugging
db = client['rawdata']
collection_bnp = db['bnp']


class worker():
    db = client['rawdata']
    collection = None
    classificationcolomn = ""
    textcolumns = ""
    filename = "dataset.ft"
    percentkept = 100

    def __init__(self, key, thread, config):
        print(config)
        #ex :"Assigned Group"
        if 'classification' in config.keys():
            self.classificationcolomn = config['classification']

        if 'columns' in config.keys():
            self.textcolumns = config['columns']
        #ex :"Summary;Notes"
        self.columns = self.textcolumns.split(';')
        print(self.columns)
        if 'datasetName' in config.keys():
            self.datasetName = config['datasetName']
        if 'version' in config.keys():
            self.version = config['version']
        if 'collection' in config.keys():
            self.collection = db[config['collection']]
        self.jsonFile = self.filename

        # log

        k = thread.redis_in.hgetall(key)
        k['state'] = 'in progress'

        timestamp = time.time()
        k['started'] = timestamp
        thread.redis_out.hmset(key, k)
        #thread.pubsub.publish(key, key)

        # self.buildTrainingData()

# script will Probably get this from a configuration file / redis key

    def preparedata(self, s):
        """
        Given a text, cleans and normalizes it.
        """

        try:
            soup = BeautifulSoup(s)
            text = soup.get_text()
            s = text
        except:
            s = s

        s = s.lower()
        # s = re.sub(r"."," ", s)
        # s = re.sub(r'\n', ' ', s)
        # s = re.sub(r'\r\n', ' ', s)
        s = re.sub(r'&nbsp;', ' ', s)
        s = re.sub(r'&#09;&#09;', ' ', s)
        s = re.sub(r'<p>', ' ', s)
        s = re.sub(r'</p>', ' ', s)
        s = re.sub(r'\«', ' ', s)
        s = re.sub(r'\»', ' ', s)
        s = re.sub(r'/<img .*?>/g', " ", s)
        s = re.sub(r'\[cid:.*?\]', " ", s)
        s = re.sub(r'\_', ' ', s)
        #s = re.sub(r'\-', ' ', s)
        s = re.sub(r'\\', ' ', s)
        s = re.sub(r'\,', ' ', s)
        s = re.sub(r'\?', ' ', s)
        s = re.sub(r'\!', ' ', s)
        s = re.sub(r'\.', ' ', s)
        s = re.sub(r'\/', ' ', s)
        s = re.sub(r'\:', ' ', s)
        s = re.sub(r'\(', ' ', s)
        s = re.sub(r'\)', ' ', s)
        s = re.sub(r'\+', ' ', s)
        s = re.sub(r'\*', ' ', s)
        s = re.sub(r'\•', ' ', s)
        s = re.sub(r'\[', ' ', s)
        s = re.sub(r'\]', ' ', s)
        s = re.sub(r'\{', ' ', s)
        s = re.sub(r'\}', ' ', s)
        s = re.sub(r'\’', ' ', s)
        s = re.sub(r'\'', ' ', s)
        s = re.sub(r'\&', ' and ', s)
        s = re.sub(r'\@', ' at ', s)
        s = re.sub(r'[0-9]{3,}', ' ', s)
        s = re.sub(r'[0-9]{2,}\s', ' ', s)
        s = re.sub(r'\"', ' ', s)
        s = re.sub(r'\#', ' ', s)
        s = re.sub(r'\s+', ' ', s)
        return s

    def removeShort(self, text):
        t = text.split(' ')
        result = []
        for s in t:
            if len(s) > 1:
                result.append(s)

        result = ' '.join(result)
        return result

    """ def run(self):
        with open(self.jsonFile) as json_file: 
        #raw should be an array of objevts with fields dict["Title"] dict["Description"] and dict["AssociatedCategory"] for example
            raw = json.load(json_file)
            ftdata = open(f'/data/{self.datasetName}/{self.version}/{self.filename}', 'w', encoding='utf-8')
            
            i = 0
            for entry in raw:
                i = i+1
                
                text = ""
                for key, value in entry.items():
                    
                    if key == self.classificationcolomn:
                        category = value.replace(' ','_')
                    else:
                    
                        if key in self.columns:
                            if value == None:
                                value = ""
                            else:
                                value = self.preparedata(value)
                                #value = self.removeShort(value)  
                                if len(value) > 0:

                                    if value[0] == ' ':
                                        value = value[1:]
                                    text = f'{text} {value}'
                        
                #subject = entry['Title']
                #body = entry['Description']
                #category= entry['AssociatedCategory']
                
                #body = preparedata(body)
                #fulltext= f'{subject!s} {body!s}'
                
                #linearray = text.split(' ')
                #we will not need all the email. Taking 75% of the words should cut most signatures / end of email garbage
                #lwords = len(linearray)
                #nbWords= int(lwords*self.percentkept/100)
                fulltext = text
                #fulltext = ' '.join(linearray[0:nbWords])
                txt= f'__label__{category!s} {fulltext!s} \n'
                if len(txt.split()) > 10:
                    ftdata.write(txt)
            ftdata.close() """

    def run(self):
        i = 0
        os.makedirs(f"/data/datasets/{self.datasetName}/{self.version}/")
        ftdata = open(
            f'/data/datasets/{self.datasetName}/{self.version}/{self.filename}', 'w', encoding='utf-8')

        # TODO: This is horrible. probably way better ways to do this
        for entry in self.collection.find():
            i = i+1
            text = ""
            for key, value in entry.items():
                if key == self.classificationcolomn:
                    category = value.replace(' ', '_')
                else:
                    if key in self.columns:
                        if value == None:
                            value = ""
                        else:
                            value = self.preparedata(value)
                            if len(value) > 0:
                                if value[0] == ' ':
                                    value = value[1:]
                                text = f'{text} {value}'
            fulltext = text
            txt = f'__label__{category!s} {fulltext!s} \n'
            if len(txt.split()) > 10:
                ftdata.write(txt)
        ftdata.close()

# This, we should get from the redis key
