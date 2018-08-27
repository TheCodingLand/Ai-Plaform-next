import json
import os


from app.model import model
from app.datafile import datafile

loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for id in preload:
        m = model(id)
        loadedModels.update( {f"{id}" : m} )

def manageAction(keyname, key):

    id=json.loads(key.get('id'))

    

    text=json.loads(key.get('text'))
    nbofresults = int(key.get('nbofresults'))
    
    if id in loadedModels.keys():
        m = loadedModels.get(id)
    else:
        m = model(id) #quantized will be implemented later
    
    
   
    result = m.predict(text=text, nbpredictions=nbofresults)
    
    loadedModels.update( {f"{id}" : m} )

    
    print(result)