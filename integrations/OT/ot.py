import requests
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
            return title


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
        return data

    def setPredictedCategory(self,id,cat):
        modurl=f'{self.api}/api/ot/objectmod/{id!s}'
        payloadmod = { 'PredictedCategory' : f'{cat!s}' }
        
        r = requests.put(url=modurl, json=payloadmod, headers=self.headers)
        print(r.json())