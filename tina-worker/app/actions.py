import json





def manageActions(keyname, key, ft):
    token = key.get('id')
    #action="predict",name=name, version=version, text=text, nbofresults=nbofresults
    if key.get("action")=="predict":
        modelname = key.get('name')
        version = key.get('version')
        text= key.get('text')
        nbofresults  = key.get('nbofresults')
        
        seletedmodel = None
        for model in ft.loadedmodels:
            if model.name == modelname and model.version == version:
                seletedmodel=model
        
        if seletedmodel == None:
            selectedmodel=ft.loadModel(modelname, version, True, False)
        if selectedmodel ==None:
            return "Failed to load model"
        else:
            result = selectedmodel.predict(text,nbofresults)
        
        return result


    if key.get("action")=="training":
        

        from app.fastTextApp import model
        from app.fastTextApp import datafile
        
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
      

    if key.get("action")=="testing":
        
        from app.fastTextApp import model
        from app.fastTextApp import datafile

        
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



    return False