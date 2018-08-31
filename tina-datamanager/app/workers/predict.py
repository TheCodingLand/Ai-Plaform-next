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
    config = None
    thread = None
    modelid = None
    nbofresults = 1
    text = ""

    def __init__(self, key, thread):
        self.thread = thread
        self.config = thread.redis_in.hgetall(key)

        print(self.config)
        if 'id' in self.config.keys():
            self.id = self.config['id']
        if 'modelid' in self.config.keys():
            self.modelid = self.config['modelid']
        if 'text' in self.config.keys():
            self.text = self.config['text']
        if 'nbofresults' in self.config.keys():
            self.nbofresults = int(self.config['nbofresults'])

        if self.modelid in loadedModels.keys():
            m = loadedModels.get(self.modelid)
        else:
            self.m = Model(self.modelid)
            self.m.load()
            loadedModels.update({f"{id}": self.m})

        #self.ftmodel = json.loads(self.config.get('model'))
        #self.ds = json.loads(self.config.get('dataset'))

    def run(self):
        result = self.m.predict(
            text=self.text, nbpredictions=self.nbofresults)
        self.config['result'] = json.dumps(result)
        return self.config
