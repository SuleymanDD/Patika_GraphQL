const {GraphQLServer} = require("graphql-yoga");
const pubsub = require("./pubsub");
const resolvers = require("./graphql/resolvers");
const db = require("./data");

const server = new GraphQLServer({
    typeDefs: `${__dirname}/graphql/schema.graphql`, 
    resolvers, 
    context: {
        pubsub,
        db,
    }
});
server.start(() =>console.log(`Server is started on localhost:4000`) )
