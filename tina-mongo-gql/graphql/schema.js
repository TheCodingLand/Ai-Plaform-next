const graphql = require('graphql');
const TrainedModelType = require('./TrainedModelType');
const TrainedModel = require('./../models/TrainedModel');

const {
		GraphQLObjectType,
		GraphQLString,
		GraphQLSchema
} = graphql;

const RootQuery = new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
				trainedmodel: {
						type: TrainedModelType,
						args: { id: { type: GraphQLString } },
						resolve(parent, args){
								return TrainedModel.findById(args.id)
						}
				}
		}
});

module.exports = new GraphQLSchema({
		query: RootQuery
});
