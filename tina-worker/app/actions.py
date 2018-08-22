



def manageActions(keyname, key, ft):
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

        modelname = key.get('model')
        version = key.get('version')
        datasetname = key.get('dataset')
        datasetversion = key.get('datasetversion')
        learningRate= float(key.get('learningRate'))
        epochs= int(key.get('epochs'))
        splitTrainingAt = key.get('splitTraining')
        
        label = key.get('label') #will be just used for metadata of the model, so we know why we trained this model for, what to predict
        m = model(modelname, version, True, False, learningRate, epochs, 3,95) #quantized will be implemented later
        data = datafile('datafile.ft', datasetname, True, datasetversion, label)
        result = m.train(data)
        return result

    if key.get("action")=="test":
        
        from app.fastTextApp import model
        from app.fastTextApp import datafile

        modelname = key.get('model')
        version = key.get('version')
        datasetname = key.get('dataset')
        datasetversion = key.get('datasetversion')
        learningRate= float(key.get('learningRate'))
        epochs= int(key.get('epochs'))
        splitTrainingAt = key.get('splitTraining')
        
        label = key.get('label') #will be just used for metadata of the model, so we know why we trained this model for, what to predict
        m = model(modelname, version, True, False, learningRate, epochs, 3,95) #quantized will be implemented later
        data = datafile('datafile.ft', datasetname, True, datasetversion, label)
        result = m.train(data)
        

        
        return result


    return False