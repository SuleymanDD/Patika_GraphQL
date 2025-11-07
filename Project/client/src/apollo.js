import { ApolloClient, InMemoryCache} from "@apollo/client";
import { OperationTypeNode } from "graphql";
import { split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
});

const wsLink = new WebSocketLink(
  new SubscriptionClient("ws://localhost:4000/", {
  })
);

const splitLink = split(
  ({ operationType }) => {
    return operationType === OperationTypeNode.SUBSCRIPTION;
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client