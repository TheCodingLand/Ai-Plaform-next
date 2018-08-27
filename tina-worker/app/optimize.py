import json
import os


from app.fastTextApp import model
from app.fastTextApp import datafile

loadedModels = {}

preload = os.environ.get('PRELOAD_MODELS') | []

for id in preload:
    m = model(id)
    loadedModels.update( {f"{id}" : m} )



def generateSettings():
    return { "epochs": random.randint(200,800), "learningRate": random.randint(1,100)/100, ngrams : random.randint(1,5) }

def manageAction(keyname, key, ft):
    i = 0
    results=[]
    dataset=json.loads(key.get('dataset'))
    data = datafile('datafile.ft', dataset['dataset']['name'], True, dataset['dataset']['version'], dataset['dataset']['classifier'])
    for i in range(0,key.get('runs')):
        settings = generateSettings()
    
    

        confidence = int(key.get('confidence'))
        
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
        m = model() #quantized will be implemented later
        m.initFromDict(settings)
        m.train(datafile)

        #data = datafile('datafile.ft', datasetname, True, datasetversion, label)
        result = m.testRun(data, confidence, delete=True)
        
        results.append(result)