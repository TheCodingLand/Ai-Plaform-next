
import json
import os
import logging
logger = logging.getLogger()

from app.model import Model
from app.dataset import Dataset

loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for id in preload:
        m = model(id)
        loadedModels.update( {f"{id}" : m} )


def manageAction(keyname, key):

    
    ftmodel=json.loads(key.get('model'))
    dataset=json.loads(key.get('dataset'))
    confidence = int(key.get('confidence'))
    
    
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
    m = Model() #quantized will be implemented later
    m.initFromDict(ftmodel)
    #data = datafile('datafile.ft', datasetname, True, datasetversion, label)
    data = Dataset('datafile.ft', dataset['dataset']['name'], True, dataset['dataset']['version'], dataset['dataset']['classifier'])
    result = m.testRun(data, confidence)
    
    logger.info(result)