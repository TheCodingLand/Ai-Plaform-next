# project/api/views.py
from flask_restplus import Namespace, Resource, fields

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.DEBUG)
import datetime
from flask import request

from fastText.api.restplus import api
from fastText.api.models.apimodels import prediction, training, getstate, loadmodel
#from fastText.app.fastTextApp import fastTextApp

# these hold our data model folder, fields list, required fields
import time
import redis, os
from random import randint
redis_host=os.getenv('REDIS_HOST')

#ft = fastTextApp()

#Here we store actions :
b = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=1)

#Here we store the state of actions
c = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=2)






def pushToRedis(action, **kwargs):
    timestamp = datetime.datetime.now()

    key = f"{action}{timestamp}{randint(1000000,9999999)}"
    data = { 'action': action }
    for item, value in kwargs.items():
        data.update({item:value})
    b.hmset(key, data)

    return key


ns = api.namespace('/', description='Api for Fasttext')

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


@api.response(400, 'failed.')
@ns.route('/load', methods=['POST'])
class load(Resource):
    @api.response(201, 'loaded : ok')
    @api.expect(loadmodel) #name, version, supervised, quantized
    def post(self):
        post_data = request.get_json()
        log.error(f"loading {post_data.get('name')} {post_data.get('version')}")
        
        pushToRedis(action="load",name=post_data.get('name'), \
                             version=post_data.get('version'), \
                             supervised = post_data.get('supervised'), \
                             quantized = post_data.get('quantized'))
        
        response_object = {
                    'status': 'queued loading request',
                    'results': post_data
                }
        return response_object, 201
        


@api.response(400, 'failed.')
@ns.route('/predict', methods=['POST'])
class predict(Resource):
    @api.response(201, 'prediction : ok')
    @api.expect(prediction) #modelname, (version), text, nbofresults
    def post(self):

        post_data = request.get_json()
        name=post_data.get('name')
        try:
            version=post_data.get('version')
        except:
            version=0
        text = post_data.get('text')
        nbofresults = post_data.get('nbofresults')
        result = ['error','']
        key = pushToRedis(action="predict",name=name, version=version, text=text, nbofresults=nbofresults)

        count =0
        while not c.hgetall(key):
            time.sleep(0.1)
            count = count + 1
            if count >100: #10 seconds
                response_object = {
                    'status': 'timeout error',
                    'results': 'please check the data input'
                }
                return response_object, 408

        k = c.hgetall(key)
        results = []
        for i in range(1,nbofresults):
            result = { 'prediction' : k.get(f'prediction{i}'), 'confidence' : k.get(f'confidence{i}') }
            results.append(result)
        

        response_object = {
            'status' : '',
            'result' : result
        }
   
    
        
     

@api.response(400, 'failed.')
@ns.route('/train', methods=['POST'])
class train(Resource):
    @api.response(201, 'ok')
    @api.expect(training) #name, version, supervised, quantized
    def post(self):
        post_data = request.get_json()
        log.error(f"training {post_data.get('name')} {post_data.get('version')}")
        
        pushToRedis(action="train",name=post_data.get('name'), \
                             version=post_data.get('version'), \
                             supervised = post_data.get('supervised'), \
                             datafile = post_data.get('datafile'))
        
        response_object = {
                    'status': 'success',
                    'results': 'launched training task'
                }
        return response_object, 201
    


@api.response(400, 'failed.')
@ns.route('/getstate', methods=['POST'])
class getstate(Resource):
    @api.response(201, 'loaded : ok')
    @api.expect(getstate) #name, version, supervised, quantized
    def post(self):
        post_data = request.get_json()
        log.error(f"getting state for {post_data.get('action')} {post_data.get('')}")
        count=0
        key = post_data.get('key')
        while not c.hgetall(key):
            time.sleep(0.1)
            count = count + 1
            if count >100: #10 seconds
                response_object = {
                    'status': 'timeout error',
                    'results': 'please check the data input'
                }
                return response_object, 408
        
        k = c.hgetall(key) 

        response_object = {
                    'status': 'success',
                    'results': k
                }
        return response_object, 201
        
