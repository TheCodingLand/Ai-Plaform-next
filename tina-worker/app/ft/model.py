import json
import os
import re
from pyfasttext import FastText
import logging
import glob, os
from app.ft.stats import prediction
from .db import db

#need to move this to a worker instance, for now we simulate

logger = logging.getLogger(__name__)
logger.setLevel('WARNING')
database =db()

MODELDIR =  "/data/models"


           
 
class Model(object):
    name =""
    version = 0
    supervised = True
    ft = None
    loaded = False
    quantized = False
    config = None
    filepath =""
    bias = 0
    ngrams = 3
    learningRate = .2
    epochs = 200
    method = ""
    model=None
    id=""
    splitAt=95
    

    def __init__(self, id=None):
        if id!=None:
            m = database.getFtModel(id)
            self.id = id
            self.initFromDict(m)

    def initFromDict(self, data):
        print(data)
        data = data['model']
        self.name = data['name']
        self.version = data['version']
        self.supervised = True
        self.quantized = False
        self.learningRate=data['learningRate']
        self.epochs=data['epochs']
        self.ngrams=data['ngrams']
        self.splitAt=data['splitAt']
        self.filepath = f"{MODELDIR}/{self.name}/{self.version!s}/model"

           
    
    def quantize(self):
            logger.error("TODO")
    def load(self):
        try:
            self.ft = FastText(self.filepath+'.bin')
        except:
            logger.error(f"Failed to Load FT file in path {self.filepath!s}")
            return "Failed to Load FT file"
        logger.info(f"loaded file {self.filepath}")
        self.loaded = True
        return "success"


    def train(self,trainingfile):
        """Starts model building"""
        self.dataset= trainingfile
        
        self.label = trainingfile.label
        
        if not os.path.exists(f"{MODELDIR}/{self.name}/{self.version!s}"):
            os.makedirs(f"{MODELDIR}/{self.name}/{self.version!s}")

    
        if self.splitAt!=None:
            self.splitTrainingData(trainingfile.fullpath, self.splitAt)
            testpath=trainingfile.fullpath+'.test'
            trainingfile.fullpath=trainingfile.fullpath+'.train'
       
        logger.info(trainingfile.fullpath)
        logger.info(f'Training started with : learningRate:{self.learningRate!s}, epochs:{self.epochs!s}, ngrams :{self.ngrams!s}')
        model = FastText()
        if self.supervised:
            model.supervised(input=trainingfile.fullpath, output=self.filepath, epoch=self.epochs, lr=self.learningRate, wordNgrams=self.ngrams, verbose=2, minCount=1)
        elif self.method == "cbow":
            model.cbow(input=trainingfile.fullpath, output='model', epoch=self.epochs, lr=self.learningRate)
        else:
            model.skipgram(input=trainingfile.fullpath, output='model', epoch=self.epochs, lr=self.learningRate)
        logger.warning("Finished training model")
        database.writeModel(self)


       
    
    def testRun(self ,dataf, threshold, delete=False):
        """this takes a model, and tests it with various paramaters. returns a result dictionnary, 
        { total : 133, threshold: 85, ignoredEntries : 10, success: 110, failures : 13 }"""
        
       
        logger.info(self.filepath)
        
        threshold = threshold/100
        model = FastText(self.filepath+'.bin')
        if dataf.splitted == True:
            f = f"{dataf.fullpath}.test"
        else:
            f=dataf.fullpath
        data=open(f,'r').readlines()
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
            
            logger.debug(f"text: {line}, confidence : {p.confidence}, predicted : {p.name}, reality : {p.correct}")
            if p.confidence > threshold:
                if p.name==p.correct:
                    p.success=True
                    correct=correct+1

                percent = correct/i*100
                logger.debug(f'efficiency so far : {percent}%')
            else:
                p.ignored=True
                i=i-1
            predictions.append(p)


        total = len(data)
        ignored = total-i
        failures = total - ignored- correct
        logger.info('finished')
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
        if delete ==True:
            os.remove(self.model.fullpath)
            os.rmdir(f"{MODELDIR}/{self.name}/{self.version!s}")
        return result


    def predict(self, text, nbpredictions=1):
        if self.loaded==False:
            return ['error',"please load model first"]
        
        logger.warning(f"making prediction for {text}")
        predictions = self.ft.predict_proba_single(text, k=nbpredictions)
        logger.warning(predictions)
        results = []
        for prediction in predictions:
            if len(prediction) ==2:
                
                result = { "category" : prediction[0], "confidence" : prediction[1] }
                results.append(result)
                logger.warning(f"{prediction[0]} {prediction[1]!s}")
        
        return results

    def splitTrainingData(self, filepath, ratio):
        """Split data in two based on ratio, training and testing files"""
        print (self.splitAt)
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
        
        




