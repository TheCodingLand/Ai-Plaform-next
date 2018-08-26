
from app import client

class db():
    
    client = client

    def getFtModel(self, id):
        m = self.client.ft.models.find_one(filter={"id":id})
        if m:
            return m
        


        return self.client.models
    def getFtDatasets(self):
        return self.client.datasets
    def getFtStats(self):
        return self.client.stats
    
    def writeModel(self,aimodel):
        model = {"model" :
        {
            "id": aimodel.id,
            "name" : aimodel.name,
            "version" : aimodel.version,
            "supervised": aimodel.supervised,
            "ft": aimodel.ft,
            "quantized": aimodel.quantized,
            "filepath": aimodel.filepath,
            "splitAt" : aimodel.splitAt,
            "bias" : aimodel.config.bias,
            "ngrams" : aimodel.config.ngrams,
            "learningRate" : aimodel.config.learningRate,
            "epochs": aimodel.config.epochs,
            "method": aimodel.config.method
            
        }
        }
        self.client.ft.models.find_one_and_replace(filter=model, replacement=model, upsert=True)
            
    def writeStat(self,stat):
        self.client.stats.insert_one(stat)
    def writeDataSet(self,dataset):
        self.client.datasets.insert_one(dataset)
        
    

