from app import client
from bson.objectid import ObjectId
class db():
    
    client = client

    def getFtModel(self, id):
        try:
            m = self.client.ft.models.find_one(filter={"_id":ObjectId(id)})
        except:
            logging.error(f'INVALID MODEL ID {id}')
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
            "name" : aimodel.name,
            "version" : aimodel.version,
            "supervised": aimodel.supervised,
            "ft": aimodel.ft,
            "quantized": aimodel.quantized,
            "filepath": aimodel.filepath,
            "splitAt" : aimodel.splitAt,
            "bias" : aimodel.bias,
            "ngrams" : aimodel.ngrams,
            "learningRate" : aimodel.learningRate,
            "epochs": aimodel.epochs,
            "label" : aimodel.label,
            "method": aimodel.method,
            "dataset" : aimodel.dataset.toDict()    
        }
        }
        self.client.ft.models.find_one_and_replace(filter=model, replacement=model, upsert=True)
            
    def writeStats(self,stat):
        
        self.client.ft.stats.insert_one(stat)
    def writeDataSet(self,dataset):
        self.client.datasets.insert_one(dataset)
        
    

