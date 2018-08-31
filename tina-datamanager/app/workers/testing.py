
import json
import os
import logging
logger = logging.getLogger()
import time
import bson

from app.ft.FBfasttext import Model
from app.ft.dataset import Dataset


class worker():
    model = None
    dataset = None
    testmodel = False
    confidence = 85
    config = None
    thread = None

    def __init__(self, key, thread):
        self.thread = thread
        self.config = thread.redis_in.hgetall(key)

        print(self.config)
        if 'id' in self.config.keys():
            self.id = self.config['id']
        if 'model' in self.config.keys():
            self.model = self.config['model']
        if 'dataset' in self.config.keys():
            self.dataset = self.config['dataset']
        if 'confidence' in self.config.keys():
            self.confidence = int(self.config['confidence'])

        self.config['state'] = 'in progress'

        timestamp = time.time()
        self.config['started'] = timestamp
        self.config['model'] = json.loads(self.config.get('model'))
        self.config['dataset'] = json.loads(self.config.get('dataset'))

        res = json.dumps(self.config)
        thread.redis_out.hmset(self.config['id'], {"data": res})
        thread.redis_out.publish(self.config['id'], self.config['id'])

        #thread.redis_out.hmset(self.id, {"data": self.config})
        #thread.redis_out.publish(self.id, self.id)

        self.ftmodel = self.config.get('model')
        self.ds = self.config.get('dataset')

    def run(self):
        m = Model()
        m.initFromDict(self.ftmodel)
        data = Dataset('datafile.ft', self.ds['dataset']['name'], True,
                       self.ds['dataset']['version'], self.ds['dataset']['classifier'])
        results = m.testRun(data, self.confidence)
        self.config['result'] = results
        return self.config
