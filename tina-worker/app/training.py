import json


from app.model import Model
from app.dataset import Dataset


def manageAction(keyname, k, redis_out):
    redis_out.hmset(k['id'], k)
    redis_out.publish(k['id'], k['id'], redis_out)
    ftmodel=json.loads(k.get('model'))
    ds=json.loads(k.get('dataset'))
    testmodel = k.get('testmodel')
    confidence = int(k.get('confidence'))

    

    
        #will be just used for metadata of the model, so we know why we trained this model for, what to predict
    m = Model() 
    m.initFromDict(ftmodel)
    
    data = Dataset('datafile.ft', ds['dataset']['name'], True, ds['dataset']['version'], ds['dataset']['classifier'])
        
    m.train(data)
    
    if testmodel == 'true':
        results = m.testRun(data,confidence)
        k['result']= json.dumps(results)
    return k
        
    