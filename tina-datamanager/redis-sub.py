import redis
import os
import threading
import logging 
channels = os.environ['REDIS_CHANNELS']


import export from src.export
import jsonToFt from src.jsonToFt

class Listener(threading.Thread):
    def __init__(self, r, channels):
        threading.Thread.__init__(self)
        self.redis = r
        self.pubsub = self.redis.pubsub()
        self.pubsub.subscribe(channels)
    
    def work(self, item):
        logging.info(item['channel'] + " : " + item['data'])
        
    def run(self):
        for item in self.pubsub.listen():
            if item['data'] == "KILL":
                self.pubsub.unsubscribe()
                print (self, "unsubscribed and finished")
                break
            else:
                self.work(item)

if __name__ == "__main__":
    r = redis.Redis()
    if len(channels) >0
        client = Listener(r, channels)
        client.start()
        
        
    else:
        logging.error("ERROR : No Channels Defined. Please register REDIS_CHANNELS environment variable")