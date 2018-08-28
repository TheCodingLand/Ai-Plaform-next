import json
import os
import random

from app.model import Model
from app.dataset import Dataset

loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS')

if preload:
    for id in preload:
        m = Model(id)
        loadedModels.update( {f"{id}" : m} )


def generateSettings():
    return { "epochs": random.randint(200,800), "learningRate": random.randint(1,100)/100, "grams" : random.randint(1,5) }

def manageAction(keyname, key):
    i = 0
    results=[]
    dataset=json.loads(key.get('dataset'))
    data = Dataset('datafile.ft', dataset['dataset']['name'], True, dataset['dataset']['version'], dataset['dataset']['classifier'])
    for i in range(0,key.get('runs')):
        settings = generateSettings()
    
    

        confidence = int(key.get('confidence'))
        
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
        m = Model() #quantized will be implemented later
        m.initFromDict(settings)
        m.train(data)

        #data = datafile('datafile.ft', datasetname, True, datasetversion, label)
        result = m.testRun(data, confidence, delete=True)
        
        results.append(result)
    key['result']= json.dumps(results)
    return key