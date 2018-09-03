import json
import os
import time
import xlrd
from collections import OrderedDict
from app import client

class worker():
    thread = None

    def __init__(self, task, thread):
        db = client['rawdata']
        
        self.thread = thread
        self.task = task
        self.collection_rawdata = db[self.task['data']['name']]
        self.filename = self.task['filename']
        #TODO add path to filename first
        self.wb = xlrd.open_workbook(self.task['path']+self.filename)
        self.sh = self.wb.sheet_by_index(0)
        #first line contains titles
        self.titles = self.sh.row_values(0)
        totalcolumns=len(self.titles)
        self.objs = []
        for rownum in self.sh.nrows[1]:
            item = OrderedDict()
            row_values = self.sh.row_values(rownum)
            i=0
            for title in self.titles:
                item[title]=row_values[i]
                i = i+1
                self.objs.append(item)
        
       

        # some service need to norify that they started :
        

    def run(self):

        self.collection_rawdata.insert_many(self.objs)

        return self.task
