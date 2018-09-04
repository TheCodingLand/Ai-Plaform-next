import requests



class email():
    id = ""
    subject = ""
    body = ""
    fulltext = ""

class Ot():
    def __init__(self, api):
        print("Initialized OT API")
        self.api = api
        self.headers = {'Content-type': 'application/json',
            'Accept': 'text/plain'}
    
    def getCategoryTitle(self,cat):
        """gets category from a custom REST JSON API for OMNITRACKER"""
        url = f'{self.api}/api/ot/object/'
        payload = {'requiredfields': ['Title']}
        predicted_url = f'{url!s}{cat!s}'
        r = requests.post(url=predicted_url, json=payload, headers=self.headers)
        data = r.json()
        if data['status'] == "success":
            title = data['data']['Title']
            t = title.split(':')[-1].strip() #Handle special case where category is not written with the usual format
            if t =="":
                t=title.strip()
            return t


    def getEmails(self):
        """GETS EMAILS BASED ON FILTER"""
        url = f'{self.api}/api/ot/objects'
        
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
        r = requests.post(url=url, json=payload, headers=self.headers)
        
        data = r.json()
        emails = []

        if data['status'] == "success":
            for email in data['Email']:
                e = email()
                e.id = email['id']
                try:
                    e.subject=email['data']['Subject']
                except:
                    e.subject=""
                e.body = email['data']['Body Plain Text']

                e.text = f'{e.subject!s} {e.body!s}'
                emails.append(e)
        return emails

    def setPredictedCategory(self,id,cat):
        modurl=f'{self.api}/api/ot/objectmod/{id!s}'
        payloadmod = { 'PredictedCategory' : f'{cat!s}' }
        
        r = requests.put(url=modurl, json=payloadmod, headers=self.headers)
        print(r.json())