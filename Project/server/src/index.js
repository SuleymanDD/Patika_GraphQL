import { createYoga, createSchema } from "graphql-yoga"
import { createServer } from "http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

import pubsub from "./pubsub";
import resolvers from "@resolvers";
import database from "./db"
import data from "./data";
import typeDefs from "@type-defs";

// Models
import User from "./models/User"
import Post from "./models/Post"
import Comment from "./models/Comment"

/*setTimeout(async() => {
  const datas = await Comment.find();
  console.log(datas)
}, 2000);*/

database();

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  graphqlEndpoint: "/",
  schema,
  context: {
    pubsub,
    db: data,
    _db: {User, Post, Comment},
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
      return { pubsub, db, _db };
    },
  },
  wsServer
);

httpServer.listen(4000, () => {
  console.info("Sunucu http://localhost:4000 adresinde çalışıyor.");
});
