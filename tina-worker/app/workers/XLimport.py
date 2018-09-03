import json
import os
import time
import xlrd
from bs4 import BeautifulSoup
from collections import OrderedDict
from app import client
import logging
class worker():
    thread = None

    def __init__(self, task, thread):
        db = client['rawdata']
        
        
   
        
        self.thread = thread
        self.task = task
        self.collection_rawdata = db[self.task['data']['name']]
        self.filename = self.task['data']['filename']
        #TODO add path to filename first
        self.wb = xlrd.open_workbook(self.task['data']['path']+self.filename)
        self.sh = self.wb.sheet_by_index(0)
        #first line contains titles
        self.titles = self.sh.row_values(0)
        totalcolumns=len(self.titles)
        self.objs = []
        for rownum in range(1,self.sh.nrows):
            item = OrderedDict()
            row_values = self.sh.row_values(rownum)
            i=0
            for title in self.titles:
                s =row_values[i]
                try:
                    if "<p>" in s:
                        soup = BeautifulSoup(s, 'lxml')
                        logging.warning(f"found html column {title}")
                        s= soup.text
                except TypeError:
                    pass
                    
                        
                item[title]=row_values[i]
                i = i+1
                self.objs.append(item)
        
       

        # some service need to norify that they started :
        

    def run(self):

        self.collection_rawdata.insert_many(self.objs)

        return self.task
