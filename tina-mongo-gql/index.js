const hapi = require('hapi');
const mongoose = require('mongoose');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');
const TrainedModel = require('./models/TrainedModel');

/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


const server = hapi.server({
	port: 4000,
	host: 'localhost'
});

mongoose.connect('mongodb://indrek:test@ds231090.mlab.com:31090/powerful-api');

mongoose.connection.once('open', () => {
	console.log('connected to database');
});

const init = async () => {

	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'TrainedModels API Documentation',
					version: Pack.version
				}
			}
		}
	]);

	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	});

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}
		}
	});


	server.route([
		{
			method: 'GET',
			path: '/api/v1/trainedmodels',
			config: {
				description: 'Get all the trainedmodels',
				tags: ['api', 'v1', 'trainedmodels']
			},
			handler: (req, reply) => {
				return TrainedModel.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/trainedmodels',
			config: {
				description: 'Get a specific trainedmodel by ID.',
				tags: ['api', 'v1', 'trainedmodel']
			},
			handler: (req, reply) => {
				const { name, url, technique } = req.payload;
				const trainedmodel = new TrainedModel({
					name,
					url,
					technique
				});

				return trainedmodel.save();
			}
		}
	]);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

process.on('unHandledRejection', (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});

init();
