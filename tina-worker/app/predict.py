import json
import os


from app.model import Model
from app.dataset import Dataset
import logging
loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for modelid in preload:
        m = Model(modelid)
        loadedModels.update( {f"{id}" : m} )

def manageAction(keyname, key):

    modelid=key.get('modelid')

    

    text=key.get('text')
    logging.error(text)
    nbofresults = int(key.get('nbofresults'))
    
    if modelid in loadedModels.keys():
        m = loadedModels.get(modelid)
    else:
        m = Model(modelid) #quantized will be implemented later
        m.load()
    logging.error(loadedModels)
    
    loadedModels.update( {f"{id}" : m} )
    
    result = m.predict(text=text, nbpredictions=nbofresults)

    key['result'] = result
    print(result)
    return key