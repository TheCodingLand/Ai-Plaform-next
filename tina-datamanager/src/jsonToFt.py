import json, re
from bs4 import BeautifulSoup

from pymongo import MongoClient
username = "root"
password = "example"

client = MongoClient('mongodb://%s:%s@tina.ctg.lu' % (username, password),27017)
db = client['rawdata']
collection_bnp = db['bnp']


class ftConverter():
    
    classificationcolomn = "Assigned Group"
    textcolumns = "Summary;Notes"
    filename = "dataset."
    percentkept = 100
    def __init__(self, config):
        print (config)
        if 'classification' in config.keys():
            self.classificationcolomn= config['classification']
        
        if 'columns' in config.keys():
            self.textcolumns = config['columns']
        
        self.columns = self.textcolumns.split(';')   
        print(self.columns)
        if 'filename' in config.keys():
            self.filename = config['filename']
        self.jsonFile=self.filename
        
        self.buildFromMongoCollection()
        #self.buildTrainingData()

#script will Probably get this from a configuration file / redis key 
    def preparedata(self, s):
        """
        Given a text, cleans and normalizes it.
        """
        
        try:
            soup = BeautifulSoup(s)
            text =soup.get_text()
            s=text
        except:
            s = s

        s = s.lower()
        # s = re.sub(r"."," ", s)
        # s = re.sub(r'\n', ' ', s)
        # s = re.sub(r'\r\n', ' ', s)
        s = re.sub(r'&nbsp;', ' ', s)
        s= re.sub(r'&#09;&#09;', ' ', s)
        s = re.sub(r'<p>', ' ', s)
        s = re.sub(r'</p>', ' ', s)
        s = re.sub(r'\«', ' ', s)
        s = re.sub(r'\»', ' ', s)
        s = re.sub(r'/<img .*?>/g'," ", s)
        s = re.sub(r'\[cid:.*?\]', " ", s)
        s = re.sub(r'\_', ' ', s)
        #s = re.sub(r'\-', ' ', s)
        s = re.sub(r'\\', ' ', s)
        s = re.sub(r'\,', ' ', s)
        s = re.sub(r'\?', ' ', s)
        s = re.sub(r'\!', ' ', s)
        s = re.sub(r'\.', ' ', s)
        s = re.sub(r'\/', ' ', s)
        s = re.sub(r'\:', ' ', s)
        s = re.sub(r'\(', ' ', s)
        s = re.sub(r'\)', ' ', s)
        s = re.sub(r'\+', ' ', s)
        s = re.sub(r'\*', ' ', s)
        s = re.sub(r'\•', ' ', s)
        s = re.sub(r'\[', ' ', s)
        s = re.sub(r'\]', ' ', s)
        s = re.sub(r'\{', ' ', s)
        s = re.sub(r'\}', ' ', s)
        s = re.sub(r'\’', ' ', s)
        s = re.sub(r'\'', ' ', s)
        s = re.sub(r'\&', ' and ', s)
        s = re.sub(r'\@', ' at ', s)
        s = re.sub(r'[0-9]{3,}', ' ', s)
        s = re.sub(r'[0-9]{2,}\s', ' ', s)
        s = re.sub(r'\"', ' ', s)
        s = re.sub(r'\#', ' ', s)
        s = re.sub(r'\s+', ' ', s)    
        return s   

    def removeShort(self, text):
        t = text.split(' ')
        result= []
        for s in t:
            if len(s)>1:
                result.append(s)
        
        result = ' '.join(result)
        return result



    def buildTrainingData(self):
        with open(self.jsonFile) as json_file: 
        #raw should be an array of objevts with fields dict["Title"] dict["Description"] and dict["AssociatedCategory"] for example
            raw = json.load(json_file)
            ftdata = open(f'{self.filename}{self.classificationcolomn}.fasttext', 'w', encoding='utf-8')
            
            i = 0
            for entry in raw:
                i = i+1
                
                text = ""
                for key, value in entry.items():
                    
                    if key == self.classificationcolomn:
                        category = value.replace(' ','_')
                    else:
                    
                        if key in self.columns:
                            if value == None:
                                value = ""
                            else:
                                value = self.preparedata(value)
                                #value = self.removeShort(value)  
                                if len(value) > 0:

                                    if value[0] == ' ':
                                        value = value[1:]
                                    text = f'{text} {value}'
                        
                #subject = entry['Title']
                #body = entry['Description']
                #category= entry['AssociatedCategory']
                
                #body = preparedata(body)
                #fulltext= f'{subject!s} {body!s}'
                
                #linearray = text.split(' ')
                #we will not need all the email. Taking 75% of the words should cut most signatures / end of email garbage
                #lwords = len(linearray)
                #nbWords= int(lwords*self.percentkept/100)
                fulltext = text
                #fulltext = ' '.join(linearray[0:nbWords])
                txt= f'__label__{category!s} {fulltext!s} \n'
                if len(txt.split()) > 10:
                    ftdata.write(txt)
            ftdata.close()
    def buildFromMongoCollection(self):
        cursor = collection_bnp.find({})
    
        i = 0
        ftdata = open(f'{self.filename}{self.classificationcolomn}.fasttext', 'w', encoding='utf-8')
        for entry in cursor:
    # do stuff with your record
        #raw should be an array of objevts with fields dict["Title"] dict["Description"] and dict["AssociatedCategory"] for example
            
        
            i = i+1
            
            text = ""
            for key, value in entry.items():
                
                if key == self.classificationcolomn:
                    category = value.replace(' ','_')
                else:
                
                    if key in self.columns:
                        if value == None:
                            value = ""
                        else:
                            value = self.preparedata(value)
                            #value = self.removeShort(value)  
                            if len(value) > 0:

                                if value[0] == ' ':
                                    value = value[1:]
                                text = f'{text} {value}'
                    
            #subject = entry['Title']
            #body = entry['Description']
            #category= entry['AssociatedCategory']
            
            #body = preparedata(body)
            #fulltext= f'{subject!s} {body!s}'
            
            #linearray = text.split(' ')
            #we will not need all the email. Taking 75% of the words should cut most signatures / end of email garbage
            #lwords = len(linearray)
            #nbWords= int(lwords*self.percentkept/100)
            fulltext = text
            #fulltext = ' '.join(linearray[0:nbWords])
            txt= f'__label__{category!s} {fulltext!s} \n'
            if len(txt.split()) > 10:
                ftdata.write(txt)
        ftdata.close()

config = { "classification" : 'Operational  Categorization Tier 2', "columns" : 'Summary;Notes' , "filename" : 'C:\\Users\\jlebourg\\Projects\\Data\\output.json' }
print (config)

ftConverter(config)