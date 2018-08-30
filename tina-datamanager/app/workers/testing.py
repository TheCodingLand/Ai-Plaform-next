
import json
import os
import logging
logger = logging.getLogger()
import time

from app.ft.model import Model
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
        if 'model' in self.config.keys():
            self.model = self.config['model']
        if 'dataset' in self.config.keys():
            self.dataset = self.config['dataset']
        if 'confidence' in self.config.keys():
            self.confidence = int(self.config['confidence'])

        self.config['state'] = 'in progress'

        timestamp = time.time()
        self.config['started'] = timestamp
        thread.redis_out.hmset(self.config.id, self.config)
        thread.redis_out.publish(self.config.id, self.config.id)
        self.ftmodel = json.loads(self.config.get('model'))
        self.ds = json.loads(self.config.get('dataset'))

    def run(self):
        m = Model()
        m.initFromDict(self.ftmodel)
        data = Dataset('datafile.ft', self.ds['dataset']['name'], True,
                       self.ds['dataset']['version'], self.ds['dataset']['classifier'])
        results = m.testRun(data, self.confidence)
        self.config['result'] = json.dumps(results)
        return self.config
