
from pymongo import MongoClient


class bd():
    client = MongoClient('mongodb', 27017)
    db = client.ft

    def getFtModels(self):
        return self.db.models
    def getFtDatasets(self):
        return self.db.datasets
    def getFtStats(self):
        return self.db.stats
    
    def writeModel(self,model):
        self.db.model.insert_one(model)
    def writeStat(self,stat):
        self.db.stats.insert_one(stat)
    def writeDataSet(self,dataset):
        self.db.datasets.insert_one(dataset)
        
    

