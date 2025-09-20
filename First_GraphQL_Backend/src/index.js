const { createYoga, createSchema } = require("graphql-yoga");
const { createServer } = require("http");
const { useServer } = require("graphql-ws/use/ws");
const { WebSocketServer } = require("ws");

const pubsub = require("./pubsub");
const resolvers = require("./graphql/resolvers");
const db = require("./data");
const typeDefs = require("./graphql/type-defs");

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  graphqlEndpoint: "/",
  schema,
  context: {
    pubsub,
    db,
  },
});

const httpServer = createServer(yoga);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: yoga.graphqlEndpoint,
});

useServer(
  {
    schema,
    context: async (ctx) => {
      return { pubsub, db };
    },
  },
  wsServer
);

httpServer.listen(4000, () => {
  console.info("Sunucu http://localhost:4000 adresinde çalışıyor.");
});
