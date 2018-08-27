
import json
import os


from app.fastTextApp import model
from app.fastTextApp import datafile

loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if type(preload) != "NoneType":
    for id in preload:
        m = model(id)
        loadedModels.update( {f"{id}" : m} )


for id in preload:
    m = model(id)
    loadedModels.update( {f"{id}" : m} )



def manageAction(keyname, key, ft):

    
    ftmodel=json.loads(key.get('model'))
    dataset=json.loads(key.get('dataset'))
    confidence = int(key.get('confidence'))
    
    
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
    m = model() #quantized will be implemented later
    m.initFromDict(ftmodel)
    #data = datafile('datafile.ft', datasetname, True, datasetversion, label)
    data = datafile('datafile.ft', dataset['dataset']['name'], True, dataset['dataset']['version'], dataset['dataset']['classifier'])
    result = m.testRun(data, confidence)
    
    print(result)