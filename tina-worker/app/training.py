import json


from app.model import model
from app.datafile import datafile


def manageAction(keyname, key):

    ftmodel=json.loads(key.get('model'))
    dataset=json.loads(key.get('dataset'))
    testmodel = key.get('testmodel')
    confidence = int(key.get('confidence'))

    

    
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
    m = model() 
    m.initFromDict(ftmodel)
    
    data = datafile('datafile.ft', dataset['dataset']['name'], True, dataset['dataset']['version'], dataset['dataset']['classifier'])
        
    m.train(data)
    if testmodel == 'true':
        m.testRun(data,confidence)
    

    



