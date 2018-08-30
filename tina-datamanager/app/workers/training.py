import json


from app.ft.FBfasttext import Model
from app.ft.dataset import Dataset
import os
import time

preload = os.environ.get('PRELOAD_MODELS')


class worker():
    model = None
    dataset = None
    testmodel = False
    confidence = 85
    config = None
    model = None
    thread = None
    ds = None

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
        if 'testmodel' in self.config.keys():
            self.testmodel = self.config['testmodel']
            if 'confidence' in self.config.keys():
                self.confidence = int(self.config['confidence'])

        self.config['state'] = 'in progress'

        timestamp = time.time()
        self.config['started'] = timestamp
        thread.redis_out.hmset(self.id, self.config)
        thread.redis_out.publish(self.id, self.id)
        self.ftmodel = json.loads(self.config.get('model'))
        self.ds = json.loads(self.config.get('dataset'))

    def run(self):

        m = Model()
        m.initFromDict(self.ftmodel)
        data = Dataset('datafile.ft', self.ds['dataset']['name'], True,
                       self.ds['dataset']['version'], self.ds['dataset']['classifier'])
        m.train(data)

        if self.testmodel == 'true':
            results = m.testRun(data, self.confidence)
            self.config['result'] = json.dumps(results)
        return self.config
