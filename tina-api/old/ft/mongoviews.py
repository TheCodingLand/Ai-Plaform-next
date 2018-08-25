
from flask_restplus import Namespace, Resource, fields

from ft import db  # Look ma!, it's easy to share resources.
from ft.api.restplus import api

mongoviews = api.namespace('/', description='Api for Fasttext')

@mongoviews.route('/')
class RawList(Resource):
    @ns.doc('list_cats')
    #@ns.marshal_list_with(cat)
    def get(self):
        '''List all cats'''
        print(db)
        return "got db"
