# ATTENMPT TO USE OFFICIAL FB LIBRARY INSTEAD OF PYFASTTEXT
# WILL ALLOW TO PRELOAD WORD VECTORS

import json
import os
import re
import fastText
import logging
import glob
import os

from .db import db

# need to move this to a worker instance, for now we simulate

logger = logging.getLogger(__name__)
logger.setLevel('WARNING')
database = db()

MODELDIR = "/data/models" 


class prediction():
    name = ""
    confidence = 0
    success = False
    ignored = False
    correct = ""

    def __init__(self, prediction, correct, k):
        self.name = prediction[0][k]
        self.name = self.name.replace("__label__", "")
        self.confidence = prediction[1][k]
        self.correct = correct


class Model(object):
    name = ""
    version = 0
    supervised = True
    ft = None
    loaded = False
    quantized = False
    config = None
    filepath = ""
    bias = 0
    ngrams = 3
    learningRate = .2
    epochs = 200
    method = ""
    model = None
    id = ""
    splitAt = 95

    def __init__(self, id=None):
        if id != None:
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
        self.learningRate = data['learningRate']
        self.epochs = data['epochs']
        self.ngrams = data['ngrams']
        self.splitAt = data['splitAt']
        self.filepath = f"{MODELDIR}/{self.name}/{self.version!s}/model"

    def quantize(self):
        logger.error("TODO")

    def load(self):
        try:
            self.ft = fastText.load_model(self.filepath+'.bin')
        except:
            logger.error(f"Failed to Load FT file in path {self.filepath!s}")
            return "Failed to Load FT file"
        logger.info(f"loaded file {self.filepath}")
        self.loaded = True
        return "success"

    def train(self, trainingfile):
        """Starts model building"""
        self.dataset = trainingfile

        self.label = trainingfile.label

        if not os.path.exists(f"{MODELDIR}/{self.name}/{self.version!s}"):
            os.makedirs(f"{MODELDIR}/{self.name}/{self.version!s}")

        if self.splitAt != None:
            self.splitTrainingData(trainingfile.fullpath, self.splitAt)
            trainingfile.fullpath = trainingfile.fullpath+'.train'

        logger.info(trainingfile.fullpath)
        logger.info(
            f'Training started with : learningRate:{self.learningRate!s}, epochs:{self.epochs!s}, ngrams :{self.ngrams!s}')

        model=fastText.train_supervised(input = trainingfile.fullpath, epoch = self.epochs,
                                          lr = self.learningRate, wordNgrams = self.ngrams, verbose = 2, minCount = 1)

        model.save_model(self.filepath+'.bin')
        logger.warning("Finished training model")
        database.writeModel(self)

    def testRun(self, dataf, threshold, delete = False):
        """this takes a model, and tests it with various paramaters. returns a result dictionnary,
        { total : 133, threshold: 85, ignoredEntries : 10, success: 110, failures : 13 }"""

        logger.info(self.filepath)

        threshold=threshold/100
        model=fastText.load_model(self.filepath+'.bin')
        if dataf.splitted == True:
            f=f"{dataf.fullpath}.test"
        else:
            f=dataf.fullpath
        
        data=open(f, 'r').readlines()
        

        i=0
        correct=0
        percent=0
        predictions=[]
        for line in data:
            i=i+1

            words=line.split(' ')
            label=words[0]  # label is always the first "word"
            line=line.replace(label+' ', '')
            line=line.replace('\n', ' ')
            # testing only the text, so we remove the label info
            label=label.replace('__label__', '')
            result=model.predict(line, k = 1)
            print(result)
            lab=result[0][0]
            print(lab)
            conf=result[1][0]
            print(conf)
            p=prediction(result, label, 0)

            logger.debug(
                f"text: {line}, confidence : {p.confidence}, predicted : {p.name}, reality : {p.correct}")
            if p.confidence > threshold:
                if p.name == p.correct:
                    p.success = True
                    correct = correct+1

                percent = correct/i*100
                logger.debug(f'efficiency so far : {percent}%')
            else:
                p.ignored = True
                i = i-1
            predictions.append(p)

        total = len(data)
        ignored = total-i
        failures = total - ignored - correct
        logger.info('finished')
        labels = []
        for p in predictions:
            if p.name not in labels:
                labels.append(p.name)
        mostFailedLabels = {}
        for label in labels:
            for p in predictions:
                if p.name == label and p.success == False:
                    if label not in mostFailedLabels.keys():
                        mostFailedLabels.update({label: 1})
                    else:
                        count = mostFailedLabels.get(label) + 1
                        mostFailedLabels.update({label: count})
        fails = []
        for key, value in mostFailedLabels.items():
            c = { "category" : key,
                    "count" : value }
            fails.append(c)

            


        result = {"total": total, "success": correct, "ignored": ignored,
                  "failures": failures, "percent": percent, "failed": fails}
        if delete == True:
            os.remove(self.model.fullpath)
            os.rmdir(f"{MODELDIR}/{self.name}/{self.version!s}")
        return result

    def predict(self, text, nbpredictions=1):
        if self.loaded == False:
            return ['error', "please load model first"]

        logger.warning(f"making prediction for {text}")
        text = text.replace('\n', ' ')
        predictions = self.ft.predict(text, k=nbpredictions)
        logger.warning(predictions)
        results = []
        i=0
        for prediction in predictions[0]:
            result = {"category": prediction.replace('__label__',''),
                        "confidence": predictions[1][i]}
            results.append(result)
            i=i+1
                

        return results

    def splitTrainingData(self, filepath, ratio):
        """Split data in two based on ratio, training and testing files"""
        print(self.splitAt)
        trainf = open(f"{filepath!s}.train", 'w')
        testf = open(f"{filepath!s}.test", 'w')
        with open(filepath) as f:
            ftf = f.readlines()
            count = len(ftf)
            breakpoint = int(count * ratio/100)
            print(breakpoint)
            train = ftf[0:breakpoint]
            test = ftf[breakpoint:-1]
            trainf.writelines(train)
            testf.writelines(test)
            trainf.close()
            testf.close()
