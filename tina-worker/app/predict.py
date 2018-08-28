import json
import os


from app.model import Model
from app.dataset import Dataset

loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for modelid in preload:
        m = Model(modelid)
        loadedModels.update( {f"{id}" : m} )

def manageAction(keyname, key):

    modelid=json.loads(key.get('modelid'))

    

    text=json.loads(key.get('text'))
    nbofresults = int(key.get('nbofresults'))
    
    if modelid in loadedModels.keys():
        m = loadedModels.get(modelid)
    else:
        m = Model(modelid) #quantized will be implemented later
    
    
   
    result = m.predict(text=text, nbpredictions=nbofresults)
    
    loadedModels.update( {f"{id}" : m} )

    
    print(result)
    return result