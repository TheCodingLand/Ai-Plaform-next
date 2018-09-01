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
    task = None
    model = None
    thread = None
    ds = None

    def __init__(self, task, thread):
        self.thread = thread
        self.task = task

        # some service need to norify that they started :
        thread.redis_out.hmset(self.task['id'], {
                               "data": json.dumps(self.task)})
        thread.redis_out.publish(self.task['id'], self.task['id'])

        self.ftmodel = self.task['data']['model']
        # TODO ALLOW ID for dataset so we can load it from MongoDB directly
        self.ds = self.task['data']['dataset']['dataset']

    def run(self):

        m = Model()
        m.initFromDict(self.ftmodel)
        data = Dataset('datafile.ft', self.ds['name'], True,
                       self.ds['version'], self.ds['classifier'])
        m.train(data)

        return self.task
