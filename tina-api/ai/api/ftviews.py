# project/api/views.py
from flask_restplus import Namespace, Resource, fields
import string
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.DEBUG)
import datetime
from flask import request
import json
from ai.api.restplus import api
from ai.api.models.apimodels import prediction, training, getstate, loadmodel
#from fastText.app.fastTextApp import fastTextApp

# these hold our data model folder, fields list, required fields
import time
import redis
import os
from random import randint, choice
redis_host = os.getenv('REDIS_HOST')

#ft = fastTextApp()

# Here we store actions :
b = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=1)

# Here we store the state of actions
c = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=2)


def genId():
    return ''.join([choice(string.ascii_letters) for i in range(10)])


def pushToRedis(key, taskid, data):

    data = json.dumps(data)
    b.hmset(key, {"data": data, "id": taskid, "key": key})
    b.publish(key, key)
    return id


ns = api.namespace(
    '/', description='Api for triggering actions to the Ai platform')


@ns.route('/schema')
class Swagger(Resource):
    def get(self):
        return api.__schema__


@ns.route('/ping')
class SanityCheck(Resource):
    def get(self):
        # log.info(json.dumps(api.__schema__))
        return {
            'status': 'success',
            'message': 'pong!'
        }


@ns.route('/predict')
@ns.response(404, 'Model Not Found')
class Model(Resource):
    '''Takes text in entry, returns a prediction using the specified model'''
    @ns.doc('predict')
    @ns.expect(prediction)
    # @api.marshal_with(prediction) #modelID, text, nbofresults
    def post(self):
        '''Fetch a given resource'''
        try:
            nbofresults = api.payload.get('nbofresults')  # default : 1
        except:
            nbofresults = 1
        if nbofresults == None:
            nbofresults = 1
        try:
            ai = api.payload.get('ai')  # default : ft
        except:
            ai = "ft"
        if ai == None:
            ai="ft"
        try:       

            modelid = api.payload.get('id')
            text = api.payload.get('text')
            
            taskid = genId()
            key = f"{ai!s}.predict.api{taskid!s}"
            data = {'key': key,
                    'action': "predict",
                    'id': taskid,
                    'modelid': modelid,
                    'text': text,
                    'nbofresults': nbofresults
                    }
            logging.error(data)
            # taskIds can be returned for long operations, so the  client can query the status of an operation
            pushToRedis(key, taskid, data)

            count = 0
            while not c.hgetall(taskid):
                time.sleep(0.1)
                count = count + 1
                if count > 100:  # 10 seconds
                    response_object = {
                        'status': 'timeout error',
                        'results': 'please check the data input'
                    }
                    return response_object, 408

            k = c.hgetall(taskid)
            logging.error(k)
            results = json.loads(k['data'])
            logging.error(results)

            response_object = {
                'status': 'ok',
                'results': results['result']
            }
            return response_object, 201
        except:
            response_object = {
                'status': 'unknown server error',
                'results': "please check input"
            }
            return response_object, 500
