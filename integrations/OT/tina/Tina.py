from bs4 import BeautifulSoup
import requests

import re


class Tina:
    def __init__(self, modelid):
        self.modelid = modelid
        print(self)
    

    def parseHtml(self, html):
        """removes HTML TAGS"""
        try:
            if bool(BeautifulSoup(html, "html.parser").find()):
                soup = BeautifulSoup(html, 'lxml')
                html= soup.text
        except TypeError:
            pass
        return html


    def predict(self, text, nbofresults=1, ai="ft", noSingleLetterWords=True, cutTextAt=100):
        """ Query for TINA to predict TEXT and return a Value"""
        text = self.parseHtml(text)
            #value = value.replace('\n',' ').strip()
        text = self.preparedata(text)
        words = text.split(' ')
        words = words[0:int(len(words)*cutTextAt/100)] #WE CAN CUT THE TEXT AT THE END TO REMOVE THE SIGNATURES
        if noSingleLetterWords:
            words  = self.removeSingleLetterWords(words)
        text = ' '.join(words)
            

        url = 'http://api.tina.lbr.lu/predict'
        headers = {'Content-type': 'application/json',
                    'Accept': 'text/plain'}
        #MODEL ID is obtained for trained models on the dashboard, console.tina.lbr.lu
    
        payload = {
            "id": self.modelid,
            "text": text,
            "nbofresults" : nbofresults,
            "ai" : ai
            }
        prediction = requests.post(url=url, json=payload, headers=headers)
        return prediction
    def preparedata(self, s):
        """
        Given a text, cleans and normalizes it.
        """
        #TODO : Concat in single REGEXP
        s = s.lower()
        s = re.sub(r'&nbsp;', ' ', s)
        s = re.sub(r'&#09;&#09;', ' ', s)
        s = re.sub(r'<p>', ' ', s)
        s = re.sub(r'</p>', ' ', s)
        s = re.sub(r'\«', ' ', s)
        s = re.sub(r'\»', ' ', s)
        s = re.sub(r'/<img .*?>/g', " ", s)
        s = re.sub(r'\[cid:.*?\]', " ", s)
        s = re.sub(r'\_', ' ', s)
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
        
    def removeSingleLetterWords(self,words):
        """Doing this significantly increase prediction quality on some datasets"""
        newWords=[]
        for word in words:
            if len(word) > 1:
                newWords.append(word)
        return newWords