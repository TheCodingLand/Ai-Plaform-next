import json
import os
import re
from pyfasttext import FastText
import logging
import glob, os
from app.stats import prediction
from .db import db

#need to move this to a worker instance, for now we simulate

logger = logging.getLogger(__name__)

database =db()

DATADIR = "/data/datafiles"
MODELDIR =  "/data/models"

#Holds configs, models and datafiles in memory 
class fastTextApp(object):
    configs= []
    loadedmodels = []
    datafiles = []

    def findDataFiles(self):
        for f in glob.glob(f"{DATADIR}*"):
            d = datafile(f,f.split('/')[-1], supervised=True)
            self.datafiles.append(d)
     
    def loadConfig(self,config):    
        c = config(config)
        c.load()
        self.configs.append(c)

    def loadConfigs(self,configs):
        
        for conf in configs:
            self.loadConfig(conf)

    def loadModel(self,name, version, supervised, quantized):
        
        m = model(name,version,supervised,quantized)
        result = m.load()
        if result == "success":
            self.loadedmodels.append(m)

        return m
        
        
    #loadallmodels ???
            


class datafile(object):
    name=""
    supervised=False
    filename=""
    version =""
    label = ""
    fullpath=""
    def __init__(self, filename, name, supervised, version =1,label="default" ):
        self.name= name
        self.supervised = supervised
        self.filename = filename
        self.version = version
        self.label= label
        self.fullpath = f"{DATADIR}/{name}/{version}/{filename}"
    
    
        
        

class config(object):
    bias = 0
    ngrams = 3
    learningRate = .2
    epochs = 200
    method = ""  #(skipgram of cbow fur unsupervised)
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if type(value) != type(getattr(self, key)):
                logger.error(f'error in type of {value} of type {type(value)} for key :{key} with type {type(getattr(self, key) )}')
            else:                    
                setattr(self, key, value)
        



class model(object):
    name =""
    version = 0
    supervised = True
    ft = None
    loaded = False
    quantized = False
    config = None
    filepath =""

    def __init__(self, id, name, version, supervised, quantized, learningRate=0.2, epochs=200, ngrams=3, splitTestDataAt=None):
        self.id=id
        self.name = name
        self.version = version
        self.supervised = supervised
        self.quantized = quantized
        self.config = config(learningRate=learningRate, epochs=epochs,ngrams=ngrams)
        self.splitTestDataAt=splitTestDataAt
        
        
        self.filepath = f"{MODELDIR}/{self.name}/{self.version!s}/model"
        
        if not os.path.exists(f"{MODELDIR}/{self.name}/{self.version!s}"):
            os.makedirs(f"{MODELDIR}/{self.name}/{self.version!s}")

    def quantize(self):
            logger.error("TODO")
    def load(self):
        try:
            self.ft = FastText(self.filepath)
        except:
            logger.error(f"Failed to Load FT file in path {self.filepath!s}")
            return "Failed to Load FT file"
        logger.info(f"loaded file {self.filepath}")
        self.loaded = True
        return "success"


    def train(self, trainingfile):
        """Starts model building"""
        if self.splitTestDataAt!=None:
            self.splitTrainingData(trainingfile.fullpath, self.splitTestDataAt)
            testpath=trainingfile.fullpath+'.test'
            trainingfile.fullpath=trainingfile.fullpath+'.train'
        skipTraining=True #debug for testing models quickly
        if skipTraining==False:
            logging.error(trainingfile.fullpath)
            logger.info(f'Training started with : learningRate:{self.config.learningRate!s}, epochs:{self.config.epochs!s}, ngrams :{self.config.ngrams!s}')
            model = FastText()
            if self.supervised:
                model.supervised(input=trainingfile.fullpath, output=self.filepath, epoch=self.config.epochs, lr=self.config.learningRate, wordNgrams=self.config.ngrams, verbose=2, minCount=1)
            elif self.config.method == "cbow":
                model.cbow(input=trainingfile.fullpath, output='model', epoch=self.config.epochs, lr=self.config.learningRate)
            else:
                model.skipgram(input=trainingfile.fullpath, output='model', epoch=self.config.epochs, lr=self.config.learningRate)
            logger.warning("Finished training model")
        database.writeModel(self)


        if self.splitTestDataAt!=None:
            logging.error(self.testRun(.75,testpath))

        return "finished"
    
    def testRun(self, threshold, data):
        """this takes a model, and tests it with various paramaters. returns a result dictionnary, 
        { total : 133, threshold: 85, ignoredEntries : 10, success: 110, failures : 13 }"""
        
    
        logging.error(self.filepath)
        
        model = FastText(self.filepath+'.bin')
        data=open(data,'r').readlines()
        i = 0
        correct = 0
        percent = 0
        predictions=[]
        for line in data:
            i=i+1
            
            words = line.split(' ')
            label = words[0] #label is always the first "word"
            line = line.replace(label+' ', '')
            #testing only the text, so we remove the label info
            label = label.replace('__label__','')
            result = model.predict_proba_single(line, k=1)
            p= prediction(result, label,0)
            
            logging.warning(f"text: {line}, confidence : {p.confidence}, predicted : {p.name}, reality : {p.correct}")
            if p.confidence > threshold:
                if p.name==p.correct:
                    p.success=True
                    correct=correct+1

                percent = correct/i*100
                logging.warning(f'efficiency so far : {percent}%')
            else:
                p.ignored=True
                i=i-1
            predictions.append(p)


        total = len(data)
        ignored = total-i
        failures = total - ignored- correct
        logging.error('finished')
        labels = []
        for p in predictions:
            if p.name not in labels:
                labels.append(p.name)
        mostFailedLabels = {}
        for label in labels:
            for p in predictions:
                if p.name == label and p.success== False:
                    if label not in mostFailedLabels.keys():
                        mostFailedLabels.update({label : 1})
                    else:
                        count = mostFailedLabels.get(label) +1
                        mostFailedLabels.update({label : count})


                    
        
        result = { "total": total, "success" : correct, "ignored" : ignored, "failures": failures, "percent" : percent, "failed" : mostFailedLabels }
        
        return result


    def predict(self, text, nbpredictions=1):
        if self.loaded==False:
            return ['error',"please load model first"]
        
        logger.info(f"making prediction for {text}")
        predictions = self.ft.predict_proba_single(text, k=nbpredictions)
        logger.info(predictions)
        results = []
        for prediction in predictions:
            if len(prediction) ==2:
                
                result = { "category" : prediction[0], "confidence" : prediction[1] }
                results.append(result)
                logger.info(f"{prediction[0]} {prediction[1]!s}")
        
        return results

    def splitTrainingData(self, filepath, ratio):
        """Split data in two based on ratio, training and testing files"""

        trainf = open(f"{filepath!s}.train",'w')
        testf = open(f"{filepath!s}.test",'w')
        with open(filepath) as f:
            ftf = f.readlines()
            count = len(ftf)
            breakpoint = int(count * ratio/100)
            print (breakpoint)
            train = ftf[0:breakpoint]
            test = ftf[breakpoint:-1]
            trainf.writelines(train)
            testf.writelines(test)
            trainf.close()
            testf.close()
        
        




