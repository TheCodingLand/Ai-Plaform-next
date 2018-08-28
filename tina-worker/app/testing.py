
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
        m = Model(id)
        loadedModels.update( {f"{id}" : m} )


def manageAction(keyname, k,redis_out):

    redis_out.hmset(k['id'], k)
    redis_out.publish(k['id'], k['id'])
    ftmodel=json.loads(k.get('model'))
    dataset=json.loads(k.get('dataset'))
    confidence = int(k.get('confidence'))
    
    
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
    m = Model() #quantized will be implemented later
    m.initFromDict(ftmodel)
    #data = datafile('datafile.ft', datasetname, True, datasetversion, label)
    data = Dataset('datafile.ft', dataset['dataset']['name'], True, dataset['dataset']['version'], dataset['dataset']['classifier'])
    result = m.testRun(data, confidence)
    
    logger.info(result)
    k['result']= json.dumps(result)

    return k