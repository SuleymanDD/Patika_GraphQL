const {ApolloServer , gql} = require("apollo-server");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core");

const {events, locations, users, participants} = require("./data");

const typeDefs = gql`
    type Event {
        id: ID!
        title: String!
        user: User!
        participants: [Participant!]!
        location: Location!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        user_id: ID!
    }
    type Location {
        id: ID!
        name: String
        desc: String
        lat: Float
        lng: Float
    }
    type User {
        id: ID!
        username: String
        email: String
    }
    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
    }

    type Query {
        events: [Event!]!
        event(id: ID!): Event!

        locations: [Location!]!
        location(id: ID!): Location!

        users: [User!]!
        user(id: ID): User

        participants: [Participant!]!
        participant(id: ID!): Participant!
    }
`;

const resolvers = {
    Query: {
        events: () => events,
        event: (parent,args) => events.find((event)=> event.id == args.id),

        locations: () => locations,
        location: (parent,args) => locations.find((location)=> location.id == args.id),

        users: () => users,
        user: (parent,args) => users.find((user)=> user.id == args.id),

        participants: () => participants,
        participant: (parent,args) => participants.find((participant)=> participant.id == args.id),
    },
    Event: {
        user: (parent) => users.find((user) => user.id == parent.user_id),
        participants: (parent) => participants.filter((participant) => participant.event_id == parent.id),
        location: (parent) => locations.find((location) => location.id == parent.location_id),
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
            //OPTİONS
        }),
    ],
});
server.listen().then(({url}) => console.log(`Appolo server is working at ${url}`));