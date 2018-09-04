#DRAFT DEBUG/TESTING     
import requests

import tina.tina as tina
import time

#MODEL to use for predictions
MODELID = "5b8e68951842adebc7309a0"
IA = tina.Tina(MODELID)


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

    data = r.json()
    return data

def setPredictedCategory(id,cat):
    modurl=f'http://ot-ws.lbr.lu:5001/api/ot/objectmod/{id!s}'
    payloadmod = { 'PredictedCategory' : f'{cat!s}' }
    headers = {'Content-type': 'application/json',
        'Accept': 'text/plain'}
    r = requests.put(url=modurl, json=payloadmod, headers=headers)
    print(r.json())






while True:
    """ INFINITE LOOP, GETS NEW EMAILS, if emails are found with no predicted category field, runs the whole process."""
    time.sleep(10)
    data = getEmails()
    #print (data['status'])
    print(data)
    if data['status'] == "success":
        for email in data['Email']:
            id = email['id']
            try:
                subject=email['data']['Subject']
            except:
                subject=""
            body = email['data']['Body Plain Text']
            text = f'{subject!s} {body!s}'
            prediction = IA.predict(text)            
            print (prediction)
            prediction = prediction.json()
            
            if prediction['status'] == "ok":
                cat = "-"
                prediction1 = prediction['results'][0]['category']
                confidence = prediction['results'][0]['confidence']
                if confidence > 0.9:
                    print (prediction1)
                    categ_title=getCategoryTitle(prediction1).split(':')[-1].strip() #cleanup category name
                    if categ_title =="":
                        categ_title=getCategoryTitle(prediction1).strip()
                    cat = categ_title
                    print(cat)
            else:
                cat = "-"
            
                
                
            setPredictedCategory(id,cat)
