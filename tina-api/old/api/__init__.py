from flask_restplus import Api, Resource

from .ftcommands import ftcommands


api = Api(
    title='My Title',
    version='1.0',
    description='A description',
    # All API metadatas
)

def register_api(app):
    api.add_namespace(ftcommands)
    api.init_app(app)


@api.route('/schema')
class Swagger(Resource):
    def get(self):
        return api.__schema__