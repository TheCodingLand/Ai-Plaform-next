import json
import os
import time

from app.ft.model import Model
from app.ft.dataset import Dataset
import logging


loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for modelid in preload:
        m = Model(modelid)
        loadedModels.update({f"{id}": m})


def manageAction(keyname, key, redis_out):

    modelid = key.get('modelid')

    text = key.get('text')
    logging.error(text)
    nbofresults = int(key.get('nbofresults'))

    if modelid in loadedModels.keys():
        m = loadedModels.get(modelid)
    else:
        m = Model(modelid)  # quantized will be implemented later
        m.load()
    logging.error(loadedModels)

    loadedModels.update({f"{id}": m})

    result = m.predict(text=text, nbpredictions=nbofresults)

    key['result'] = json.dumps(result)
    print(result)
    return key


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
        if 'modelid' in self.config.keys():
            self.modelid = self.config['modelid']
        if 'text' in self.config.keys():
            self.text = self.config['text']
        if 'nbofresults' in self.config.keys():
            self.nbofresults = int(self.config['nbofresults'])

        if modelid in loadedModels.keys():
            m = loadedModels.get(modelid)
        else:
            m = Model(modelid)
            m.load()
            loadedModels.update({f"{id}": m})

        thread.redis_out.hmset(key, self.config)
        thread.redis_out.publish(key, key)
        self.ftmodel = json.loads(key.get('model'))
        self.ds = json.loads(key.get('dataset'))

    def run(self):
        result = m.predict(
            text=self.text, nbpredictions=self.nbofresults)
        self.config['result'] = json.dumps(result)
        return self.config
