#DRAFT DEBUG/TESTING
            
import requests
import time
import os, re
from bs4 import BeautifulSoup


def parseHtml(html):
    """removes HTML TAGS"""
    try:
        if "<p>" in html:
            soup = BeautifulSoup(html, 'lxml')
            html= soup.text
    except TypeError:
        pass
    return html

def getCategoryTitle(cat):
    """gets category from a custom REST JSON API for OMNITRACKER"""
    c_url = 'http://ot-ws.lbr.lu:5001/api/ot/object/'
    c_headers = {'Content-type': 'application/json',
                   'Accept': 'text/plain'}
    c_payload = {'requiredfields': ['Title']}
    predicted_url = f'{c_url!s}{cat!s}'
    r = requests.post(url=predicted_url, json=c_payload, headers=c_headers)
    data = r.json()
    if data['status'] == "success":
        title = data['data']['Title']
        return title


def preparedata(s):
    """
    Given a text, cleans and normalizes it.
    """

    s = s.lower()
    # s = re.sub(r"."," ", s)
    # s = re.sub(r'\n', ' ', s)
    # s = re.sub(r'\r\n', ' ', s)
    s = re.sub(r'&nbsp;', ' ', s)
    s = re.sub(r'&#09;&#09;', ' ', s)
    s = re.sub(r'<p>', ' ', s)
    s = re.sub(r'</p>', ' ', s)
    s = re.sub(r'\«', ' ', s)
    s = re.sub(r'\»', ' ', s)
    s = re.sub(r'/<img .*?>/g', " ", s)
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


def preparedata(s):
    """
    Given a text, cleans and normalizes it.
    """

    s = s.lower()
    s= s.replace(".","")
    # Replace ips
    s = re.sub(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', ' _ip_ ', s)
    # Isolate punctuation, remove numbers
    s = re.sub(r'([\'\"\.\(\)\!\?\-\\\/\,])', r' \1 ', s)
    s = re.sub(r'([0-9])' , ' ', s)
    s = s.replace('*', '')
    s = s.replace('_', '')
    # Remove some special characters
    s = re.sub(r'([\;\:\|•«\n])', ' ', s)

    s = s.replace('&', ' and ')
    s = s.replace('@', ' at ')
    return s

def getEmails():
    """GETS EMAILS BASED ON FILTER"""
    url = 'http://ot-ws.lbr.lu:5001/api/ot/objects'
    headers = {'Content-type': 'application/json',
                   'Accept': 'text/plain'}


    payload = {
        "objectclass": "Email",
        "filter": "emailtopredict",
        "variables": [
            {
            }
        ],
        "requiredfields": [
            "Subject",
            "Body Plain Text"
        ]
    }
    r = requests.post(url=url, json=payload, headers=headers)
    print (r.status_code)
    data = r.json()
    return data


def predict(text):
    """ Query for TINA to predict TEXT and return a Value"""

    url = 'http://ai-api.lbr.lu/predict'
    headers = {'Content-type': 'application/json',
                   'Accept': 'text/plain'}
    #MODEL ID is obtained for trained models on the dashboard, console.tina.lbr.lu
    modelid = "5b8d3c0b2643e8676c3b77a6"
    payload = {
        "id": modelid,
        "text": text }
    prediction = requests.post(url=url, json=payload, headers=headers)
    return prediction

while True:
    """ INFINITE LOOP, GETS NEW EMAILS, if emails are found with no predicted category field, runs the whole process."""
    time.sleep(20)
    data = getEmails()
    #print (data['status'])
    if data['status'] == "success":
        for email in data['Email']:
            id = email['id']
            try:
                subject=email['data']['Subject']
            except:
                subject=""
            body = email['data']['Body Plain Text']
            value = parseHtml(f'{subject!s} {body!s}')
            value = value.replace('\n',' ').strip()
            value = value.split(' ')
            #value = value[0:int(len(value)*55/100)] #WE CAN CUT THE TEXT AT THE END TO REMOVE THE SIGNATURES
            value = ' '.join(value)
            
            value = preparedata(value)
            
            #print(value)   
            
            prediction = predict(value)
            

            prediction = prediction.json()
            #print(prediction)
            if prediction['status'] == "ok":
                cat = "-"
                prediction1 = prediction['results'][0]['category']
                confidence = prediction['results'][0]['confidence']
                if confidence > 0.7:
                    print (prediction1)

                    categ_title=getCategoryTitle(prediction1).split(':')[-1].strip() #cleanup category name

                    if categ_title =="":
                        categ_title=getCategoryTitle(prediction1).strip()

                    cat = categ_title

                    print(cat)
            else:
                cat = "-"
            
                
                

            modurl=f'http://ot-ws.lbr.lu:5001/api/ot/objectmod/{id!s}'
            #Modify object into the custom omnitracker API
            print(modurl)
            payloadmod = { 'PredictedCategory' : f'{cat!s}' }
            print (payloadmod)
            headers = {'Content-type': 'application/json',
                'Accept': 'text/plain'}

            r = requests.put(url=modurl, json=payloadmod, headers=headers)
            print(r.json())
