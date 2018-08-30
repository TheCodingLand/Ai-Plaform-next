import redis
import os
import threading
import logging
import time

channel = os.getenv('CHANNEL')

WORKER = os.getenv('WORKER')
channel = WORKER
""" if WORKER == "predict":
    import app.predict as worker
if WORKER == "training":
    import app.training as worker
if WORKER == "testing":
    import app.testing as worker
if WORKER == "optimize":
    import app.optimize as worker """
if WORKER == "datasetbuilder":
    import app.mongoToFt as worker

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
    testredis.hmset(f'ft.{channel}TEST', {"classification": 'Operational  Categorization Tier 2',
                                          "columns": 'Summary;Notes', 'datasetName': 'bnp', 'version': 1})
    testpubsub = redis.Redis(host=redis_host, decode_responses=True, port=6379)
    testpubsub.publish(f'ft.{channel}TEST', f'ft.{channel}TEST')


class Listener(threading.Thread):
    def __init__(self, r, channel):
        threading.Thread.__init__(self)

        self.redis_in = redis.StrictRedis(
            host=redis_host, decode_responses=True, port=6379, db=1)
        self.redis_out = redis.StrictRedis(
            host=redis_host, decode_responses=True, port=6379, db=2)

        self.redis = r
        self.pubsub = self.redis.pubsub()
        self.pubsub.psubscribe([f'ft.{channel}*'])
        time.sleep(5)
        test()

    def work(self, item):
        logging.info(item['channel'])
        logging.info(item['data'])

        config = self.redis_in.hmget(item['channel'], item['data'])
        logging.info(config)
        # config = { "classification" : 'Operational  Categorization Tier 2', "columns" : 'Summary;Notes', 'datasetName' : 'bnp', 'version' : 1 }
        job = worker.worker(item['channel'], self, config)

        job.run()

    def run(self):
        for item in self.pubsub.listen():
            if item['data'] == "KILL":
                self.pubsub.unsubscribe()
                print(self, "unsubscribed and finished")
                break
            else:
                self.work(item)


if __name__ == "__main__":
    r = redis.Redis(host=redis_host, decode_responses=True, port=6379)
    if channel:
        client = Listener(r, channel)
        client.start()

    else:
        logging.error(
            "ERROR : No Channel Defined. Please register CHANNEL environment variable")
