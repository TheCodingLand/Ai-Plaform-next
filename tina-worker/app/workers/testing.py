
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
    task = None
    thread = None

    def __init__(self, task, thread):
        self.thread = thread
        self.task = task
        # some service need to norify that they started :
        thread.redis_out.hmset(self.task['id'], {
                               "data": json.dumps(self.task)})
        thread.redis_out.publish(self.task['id'], self.task['id'])

        #thread.redis_out.hmset(self.id, {"data": self.task})
        #thread.redis_out.publish(self.id, self.id)

        self.ftmodel = self.task['data']['model']
        self.ds = self.task['data']['dataset']['dataset']

    def run(self):
        m = Model()
        m.initFromDict(self.ftmodel)
        data = Dataset('datafile.ft', self.ds['dataset']['name'], True,
                       self.ds['dataset']['version'], self.ds['dataset']['classifier'])
        results = m.testRun(data, self.confidence)
        self.task['result'] = results
        return self.task
