import json
import os
import time

from app.ft.FBfasttext import Model
from app.ft.dataset import Dataset
import logging


loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for modelid in preload:
        m = Model(modelid)
        loadedModels.update({f"{id}": m})


class worker():
    loadedModels = loadedModels
    model = None
    dataset = None
    testmodel = False
    confidence = 85
    task = None
    thread = None
    modelid = None
    nbofresults = 1
    text = ""

    def __init__(self, task, thread):
        self.thread = thread
        self.task = task

        if 'text' in task['data'].keys():
            self.modelid = task['data']['text']
        else:
            task['error'] = 'No text specified'

        if 'nbofresults' not in task['data'].keys():
            self.nbofresults = 1
        else:
            self.nbofresults = int(task['data']['nbofresults'])

        if 'modelid' in task['data'].keys():
            self.modelid = task['data']['modelid']
        else:
            task['error'] = 'No model specified'

        if self.modelid in loadedModels.keys():
            self.m = loadedModels.get(self.modelid)
        else:
            self.m = Model(self.modelid)
            self.m.load()
            loadedModels.update({f"{id}": self.m})

        # self.ftmodel = json.loads(self.task.get('model'))
        # self.ds = json.loads(self.task.get('dataset'))

    def run(self):
        result = self.m.predict(
            text=self.text, nbpredictions=self.nbofresults)
        self.task['result'] = result
        return self.task
