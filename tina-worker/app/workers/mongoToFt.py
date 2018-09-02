import json
import re
from bs4 import BeautifulSoup
import os
import time
from pymongo import MongoClient
from app import client


class worker():
    client = client

    collection = None
    classificationcolomn = ""
    textcolumns = ""
    filename = "dataset.ft"
    percentkept = 100
    task = None
    thread = None
    id = None

    def __init__(self, task, thread):
        self.raw_database = self.client['rawdata']
        self.thread = thread
        self.task = task
        if 'classification' in self.task['data'].keys():
            self.classificationcolomn = self.task['data']['classification']
        if 'columns' in self.task['data'].keys():
            self.columns = self.task['data']['columns']

        if 'datasetName' in self.task['data'].keys():
            self.datasetName = self.task['data']['datasetName']
        if 'version' in self.task['data'].keys():
            self.version = self.task['data']['version']
        if 'collection' in self.task['data'].keys():
            self.collection = self.raw_database[self.task['data']
                                                ['collection']]

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
        self.client.ft.models.find_one_and_replace(
            filter=self.task['data'], replacement=self.task['data'], upsert=True)

        return self.task

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


# This, we should get from the redis key
