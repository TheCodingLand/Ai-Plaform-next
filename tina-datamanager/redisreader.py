import redis
import os
import threading
import logging
import time
from app import client as db
channel = os.getenv('CHANNEL')

WORKER = os.getenv('WORKER')
channel = WORKER
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

logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
redis_host = os.getenv('REDIS_HOST')


def test():
    testredis = redis.StrictRedis(
        host=redis_host, decode_responses=True, port=6379, db=1)
    testredis.hmset(f'ft.{channel}.TEST', {"classification": 'Operational  Categorization Tier 2',
                                           "columns": 'Summary;Notes', 'datasetName': 'bnp', 'version': 99, 'collection': 'bnp'})
    testpubsub = redis.Redis(host=redis_host, decode_responses=True, port=6379)
    testpubsub.publish(f'ft.{channel}.TEST', f'ft.{channel}.TEST')


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
            job = worker.worker(item['channel'], self)
            result = job.run()
            # write result database and notify redis of new info
            self.database.results.insert_one(result)
            self.redis_out.hmset(result['id'], result)
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
