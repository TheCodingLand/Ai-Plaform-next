import redis
import time
import logging

import os
import json

action = os.getenv('ACTION')
if action == "predict":
    import app.predict as actions
if action == "training":
    import app.training as actions
if action == "testing":
    import app.testing as actions
if action == "optimize":
    import app.optimize as actions

redis_host=os.getenv('REDIS_HOST')

Loglevel = os.getenv('LOGLEVEL')


logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
        '%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)



#read keys from here
redis_in = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=1)
logger.debug('reading keys from redis db 1')
#write work job status here :
redis_out = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=2)





while True:
    keys = redis_in.keys(f'ft.{action}*')
    if len(keys) == 0:
        time.sleep(0.1)

    for key in keys:
        try:
            k = redis_in.hgetall(key)
        except redis.exceptions.ResponseError:
            logging.error('Failed to deal with key %s' % key)
            redis_in.delete(key)
            continue
        logger.debug("got key :%s", key)
        redis_in.delete(key)
        k['state']= 'in progress'
        redis_out.hmset(key, k)
        result = actions.manageAction(key, k)
        #keyname, data, ft object
        
        k['state']= 'finished'
        k['result']= json.dumps(result)
       
        redis_out.hmset(k['id'], k)
        redis_out.publish(k['id'], key)

            
            