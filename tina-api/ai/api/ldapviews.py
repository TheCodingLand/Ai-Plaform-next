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
import ldap
#from fastText.api.models.apimodels import prediction, training, getstate, loadmodel
#from fastText.app.fastTextApp import fastTextApp

# these hold our data model folder, fields list, required fields
import time
import redis
import os
import jwt
from random import randint, choice
redis_host = os.getenv('REDIS_HOST')
try:
    LDAP_SESSION_EXPIRE_TIME = int(os.getenv('LDAP_SESSION_EXPIRE_TIME'))
except:
    LDAP_SESSION_EXPIRE_TIME = 3600
DOMAIN = os.getenv('DOMAIN')

def get_ldap_connection():
    conn = ldap.initialize('ldap://dcrcsl01.rcsl.lu:389/')
    conn.protocol_version = 3
    conn.set_option(ldap.OPT_REFERRALS, 0)
    return conn
#ft = fastTextApp()

# Here we store actions :
usersRedisDb = redis.StrictRedis(host=redis_host, decode_responses=True, port=6379, db=1)

# Here we store the state of actions



ns = api.namespace(
    'auth', description='Api for authentification')


login_model = api.model( 'login:', {
    'username' : fields.String(description='ldap username'),
    'password': fields.String(description='ldap password'),
    'domain'  : fields.String(description='Domain', default = f"{DOMAIN}"),
    
})

verify_token_model = api.model( 'verify:', {
    'token' : fields.String(description='jwt'),     
})

def loggedin(token):
    try:
        user = usersRedisDb.hgetall(f"user.{token}")
    except:
         return False
    try:
        result = user
    except:
        result = False
   
    
    return result





@ns.route('/login')
@ns.response(404, 'user not found')
class Login(Resource):
    @ns.doc('login')
    @ns.expect(login_model)
    def post(self):
        '''logins with ldap'''
        conn = get_ldap_connection()
        try:
            username = api.payload.get('username')
            password = api.payload.get('password')
            domain = api.payload.get('domain')
        except:
            response_object = {
                        "status": "error",
                        "error": "could not get fields username or password. please check input"
                    }
            try: 
                return response_object, 403
            except:
                logging.error("failed to serialize response object")
                logging.error(response_object)

        try:
            conn.simple_bind_s(username + "@" + domain, password)
            base_dn = 'dc=rcsl,dc=lu'
            filter = f'(&(objectClass=user)(sAMAccountName={username}))'
            attrs = ['sAMAccountName','memberOf', 'displayName', 'userAccountControl', 'accountExpires']
            result = conn.search_s(base_dn, ldap.SCOPE_SUBTREE, filter, attrs)
            if len(result)>0:
                result = result[0][1]
                logging.error(result)
                for attr, value in result.items():
                    result[attr] = value[0].decode('utf-8')
        
            


        except:
            response_object = {
                        "status": "incorrect username or password",
                        "error": "please check your input"
                    }
            try: 
                return response_object, 403
            except:
                logging.error("failed to serialize response object")
                logging.error(response_object)
    
        
        token = jwt.encode({ "user" : result }, "secret", "HS256")
        #token = username
        result.update({
            'username' : username,
            'token' : token.decode('utf-8'),
            })
        usersRedisDb.hmset(f"user.{token.decode('utf-8')}", result )
        usersRedisDb.expire(f"user.{token.decode('utf-8')}", LDAP_SESSION_EXPIRE_TIME)
        
        #Success : 
        
        response_object = {
            "username" : username,
            "token" : token.decode('utf-8'),
            "result" : "success"        
        }        
        try:
            return response_object, 200
        except:
            logging.error("failed to serialize response object")
            logging.error(response_object)

        

@ns.route('/verify')
@ns.response(404, 'user not found')
class Verify(Resource):
    @ns.doc('verify')
    @ns.expect(verify_token_model)
    def post(self):
        '''verify if user is logged in with ldap'''
    
        try:
            token = api.payload.get('token')
        except:
        
            response_object = {
                        'status': 'error',
                        'error': 'need token in payload'
                    }
            return response_object, 403

        
        user = loggedin(token)
        if user == False:
            response_object = {
                        'status': 'error',
                        'error': 'user is not logged in'
                    }
            return response_object, 403
        else:

            response_object = {
            'username' : user['username'],
            'token' : token,
            'result' : 'success'

            }
            response_object.update(user)

            return response_object, 200

            