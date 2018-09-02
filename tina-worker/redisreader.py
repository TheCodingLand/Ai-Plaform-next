import redis
import os
import threading
import logging
import time
from app import client as db
channel = os.getenv('CHANNEL')
import json
import bson
WORKER = os.getenv('WORKER')
channel = WORKER
from bson.json_util import loads
if WORKER == "predict":
    import app.workers.predict as worker
if WORKER == "training":
    import app.workers.training as worker
if WORKER == "testing":
    import app.workers.testing as worker
if WORKER == "optimize":
    import app.workers.optimize as worker
if WORKER == "datasetbuilder":
    import app.workers.mongoToFt as worker
if WORKER == "upload":
    import app.wip.XLexport as worker

logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
redis_host = os.getenv('REDIS_HOST')



class Listener(threading.Thread):
    def __init__(self, r, channel):
        threading.Thread.__init__(self)
        
        self.database = db
        self.redis_in = redis.StrictRedis(
            host=redis_host, decode_responses=True, port=6379, db=1)
        self.redis_out = redis.StrictRedis(
            host=redis_host, decode_responses=True, port=6379, db=2)
        
        self.redis = r
        self.pubsub = self.redis.pubsub()
        self.pubsub.psubscribe([f'ft.{channel}.*'])
        # time.sleep(5)
        # test()
    
    def work(self, item):

        logging.info(item['channel'])
        logging.info(item['data'])
        if item['data'] != 1:
            state='ok'
            try:
                data = self.redis_in.hgetall(item['channel'])
                k = self.redis_in.delete(item['channel'])
            except:
                state='already in progress'
            if k == 0:
                state='already in progress'

            try:
                data['data'] = json.loads(data['data'])
            except KeyError:
                state='already in progress'
            if state=='ok':
                
                #reserve this job for worker
               
                logging.warning(data)
                
                
                

                data['state'] = 'in progress'
                timestamp = time.time()
                data['started'] = timestamp

                job = worker.worker(data, self)
                if 'error' in job.task.keys():
                    job.task['state'] = "error"
                    res = json.dumps(job.task)
                    self.redis_out.hmset(job.task['id'], {"data": res})
                    self.redis_out.publish(job.task['id'], job.task['id'])
                else:

                    result = job.run()
                    result['state'] = "finished"

                    timestamp = time.time()
                    result['finished'] = timestamp
                    # write result database and notify redis of new info
                    res = json.dumps(result)
                    self.database.results.actions.insert_one(loads(res))

                    self.redis_out.hmset(result['id'], {"data": res})
                    self.redis_out.publish(result['id'], result['id'])

    def run(self):
        for item in self.pubsub.listen():
            if item['data'] == "KILL":
                self.pubsub.unsubscribe()
                print(self, "unsubscribed and finished")
                break
            else:
                logging.info(item)
                self.work(item)


if __name__ == "__main__":
    r = redis.Redis(host=redis_host, decode_responses=True, port=6379)
    if channel:
        client = Listener(r, channel)
        client.start()

    else:
        logging.error(
            "ERROR : No Channel Defined. Please register CHANNEL environment variable")
