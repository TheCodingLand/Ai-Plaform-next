
from flask_restplus import fields
from fastText.api.restplus import api
 

prediction = api.model( 'predict:', {
    'id' : fields.String(description='id of a trained model'),
    'text': fields.String(description='text to feed the prediction algorithm'),
    'ai' : fields.String(description="AI Algorithm", default = "ft"),
    'nbofresults': fields.Integer(description='Number of labels to return', default = 1),
})

loadmodel = api.model('loadmodel:', {
    'name': fields.String(description='name of the model'),
    'version': fields.Integer(description="model version optional : 0 by default'"),
    'supervised': fields.Boolean(),
    'quantized': fields.Boolean()

}
    )

training = api.model('model:', {
    'name': fields.String(description='name of the model'),
    'version': fields.Integer(description="model version optional : 0 by default'"),
    'supervised': fields.Boolean(),
    'datafile': fields.String(description='path of the file'),
    #TODO ADD CONFIG
    
})



getstate = api.model('training:', {
    'key': fields.String(description='key identifier returned by your the first request'),
    
})
