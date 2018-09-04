#DRAFT DEBUG/TESTING     


import tina
import time
import ot

#MODEL to use for predictions
MODELID = "5b8e68951842adebc7309a0e"
IA = tina.Tina(MODELID)
API = "http://ot-ws.lbr.lu:5001"
OT = ot.Ot(API)


while True:
    """ INFINITE LOOP, GETS NEW EMAILS, if emails are found with no predicted category field, runs the whole process."""
    time.sleep(10)
    data = OT.getEmails()
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
                if len(prediction['results']) > 0:
                    prediction1 = prediction['results'][0]['category']
                    confidence = prediction['results'][0]['confidence']
                    if confidence > 0.9:
                        print (prediction1)
                        categ_title=OT.getCategoryTitle(prediction1).split(':')[-1].strip() #cleanup category name
                        if categ_title =="":
                            categ_title=OT.getCategoryTitle(prediction1).strip()
                        cat = categ_title
                        print(cat)
                    else:
                        cat = "-"          
                    OT.setPredictedCategory(id,cat)
