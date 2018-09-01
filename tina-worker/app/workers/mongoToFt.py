import json
import re
from bs4 import BeautifulSoup
import os
import time
from pymongo import MongoClient
from app import client


class worker():
    db = client['rawdata']
    collection = None
    classificationcolomn = ""
    textcolumns = ""
    filename = "dataset.ft"
    percentkept = 100
    config = None
    thread = None
    id = None

    def __init__(self, key, thread):
        self.thread = thread
        self.config = thread.redis_in.hgetall(key)
        if 'classification' in self.config.keys():
            self.classificationcolomn = self.config['classification']
        if 'columns' in self.config.keys():
            self.textcolumns = self.config['columns']
        self.columns = self.textcolumns.split(';')
        print(self.columns)
        if 'datasetName' in self.config.keys():
            self.datasetName = self.config['datasetName']
        if 'version' in self.config.keys():
            self.version = self.config['version']
        if 'collection' in self.config.keys():
            self.collection = self.db[self.config['collection']]
        if 'id' in self.config.keys():
            self.id = self.config['id']

        # log

        self.config['state'] = 'in progress'

        timestamp = time.time()
        self.config['started'] = timestamp
        thread.redis_out.hmset(self.config['id'], {
                               "data": json.dumps(self.config)})
        thread.redis_out.publish(self.config['id'], self.config['id'])

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

    def run(self):
        i = 0
        if not os.path.exists(f"/data/datasets/{self.datasetName}/{self.version}/"):
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
        return self.config

# This, we should get from the redis key
