#SIMPLE TINA INTEGRATION : REST API OMNITRACKER
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
    emails = OT.getEmails()
    for email in emails:
        text = email.text
        prediction = IA.predict(text)
        prediction = prediction.json()
        if prediction['status'] == "ok":
            cat = "-"
            if len(prediction['results']) > 0:
                prediction1 = prediction['results'][0]['category']
                confidence = prediction['results'][0]['confidence']
                if confidence > 0.9:
                    cat=OT.getCategoryTitle(prediction1) #cleanup category name
                else:
                    cat = "-"          
                OT.setPredictedCategory(email.id,cat)
