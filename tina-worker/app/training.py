import json


from app.model import Model
from app.dataset import Dataset


def manageAction(keyname, key):

    ftmodel=json.loads(key.get('model'))
    ds=json.loads(key.get('dataset'))
    testmodel = key.get('testmodel')
    confidence = int(key.get('confidence'))

    

    
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
    m = Model() 
    m.initFromDict(ftmodel)
    
    data = Dataset('datafile.ft', ds['dataset']['name'], True, ds['dataset']['version'], ds['dataset']['classifier'])
        
    m.train(data)
    if testmodel == 'true':
        m.testRun(data,confidence)