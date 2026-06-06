import { createYoga, createSchema } from "graphql-yoga"
import { createServer } from "http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import {nanoid} from "nanoid";
import { withFilter } from "graphql-subscriptions";

import db from "./data.js";
import pubsub from "./pubsub.js"

const typeDefs = `
    type Message {
        id: ID!
        text: String!
        sender: String!
    }
    
    type Query {
        messages: [Message!]!
    }
    
    type Mutation {
        sendMessage(text: String!, sender: String!): Message!
    }

    type Subscription {
        messageSent: Message!
    }
`;

const resolvers = {
    Query: {
        messages: (_, __, { db }) => db.messages,   
    },
    Mutation: {
        sendMessage: (_, { text, sender }, { db }) => {
            const message = { id: nanoid(), text, sender };
            db.messages.push(message);
            pubsub.publish("MESSAGE_SENT", { messageSent: message });
            return message;
        }
    },
    Subscription: {
        messageSent: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("MESSAGE_SENT")
        }
    }
};

const schema = createSchema({
    typeDefs,
    resolvers,
});

const yoga = createYoga({
    graphqlEndpoint: "/",
    schema,
    context: { db, pubsub },
});

const server = createServer(yoga);
const wsServer = new WebSocketServer({
    server,
    path: yoga.graphqlEndpoint,
});

useServer({ schema, context: { db, pubsub } }, wsServer);

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${yoga.graphqlEndpoint}`);
});