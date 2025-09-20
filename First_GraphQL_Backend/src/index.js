import { createYoga, createSchema } from "graphql-yoga"
import { createServer } from "http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

import pubsub from "./pubsub";
import resolvers from "@resolvers";
import db from "./data";
import typeDefs from "@type-defs";

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
