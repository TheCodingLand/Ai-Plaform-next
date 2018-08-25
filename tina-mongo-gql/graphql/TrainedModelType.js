const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const TrainedModelType = new GraphQLObjectType({
    name: 'TrainedModel',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        technique: { type: GraphQLString }
    })
});

module.exports = TrainedModelType;
