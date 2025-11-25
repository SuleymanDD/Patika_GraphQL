import { createYoga, createSchema } from "graphql-yoga"
import { createServer } from "http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import {nanoid} from "nanoid";
import { withFilter } from "graphql-subscriptions";

import db from "./data.js";
import pubsub from "./pubsub.js"


const typeDefs = `
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

    input CreateEventInput{
        title: String, desc: String, date: String, from: String, to: String, location_id: ID, user_id: ID
    }
    input UpdateEventInput{
        title: String, desc: String, date: String, from: String, to: String, location_id: ID, user_id: ID
    }

    type Location {
        id: ID!
        name: String
        desc: String
        lat: Float
        lng: Float
    }

    input CreateLocationInput{
        name: String!, desc: String!, lat: Float!, lng: Float!
    }
    input UpdateLocationInput{
        name: String, desc: String, lat: Float, lng: Float
    }

    type User {
        id: ID!
        username: String
        email: String
    }

    input CreateUserInput{
        username: String!, email: String!
    }
    input UpdateUserInput{
        username: String, email: String
    }

    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
        user: User
    }

    input CreateParticipantInput{
        user_id: ID, event_id: ID
    }
    input UpdateParticipantInput{
        user_id: ID, event_id: ID
    }

    type DeleteAllData{
        count: Int!
    }

    type Query {
        # Event
        events: [Event!]!
        event(id: ID!): Event!

        # Location
        locations: [Location!]!
        location(id: ID!): Location!

        # User
        users: [User!]!
        user(id: ID): User

        # Participant
        participants: [Participant!]!
        participant(id: ID!): Participant!
    }

    type Mutation {
        # Event
        createEvent(data: CreateEventInput!): Event!
        updateEvent(id: ID!, data: UpdateEventInput!): Event!
        deleteEvent(id: ID!): Event!
        deleteAllEvents: DeleteAllData!

        # Location
        createLocation(data: CreateLocationInput!): Location!
        updateLocation(id: ID!, data: UpdateLocationInput!): Location!
        deleteLocation(id: ID!): Location!
        deleteAllLocations: DeleteAllData!

        # User
        createUser(data: CreateUserInput!): User!
        updateUser(id: ID!, data: UpdateUserInput!): User!
        deleteUser(id: ID!): User!
        deleteAllUsers: DeleteAllData!

        # Participant
        createParticipant(data: CreateParticipantInput!): Participant!
        updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
        deleteParticipant(id: ID!): Participant!
        deleteAllParticipants: DeleteAllData!
    }
    
    type Subscription {
        # User
        userCreated: User!

        # Event
        eventCreated: Event

        # Participant
        participantCreated(event_id: ID!): Participant
    }
`;

const resolvers = {
    Subscription: {
        // User
        userCreated: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("userCreated"),
        },

        // Event
        eventCreated: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("eventCreated"),
        },

        // Participant
        participantCreated: {
            subscribe:withFilter (
                (_,__,{pubsub}) => pubsub.asyncIterator("participantCreated"),
                (payload, variables) => {
                    return variables.event_id ? (payload.participantCreated.event_id === variables.event_id) : true;
                }
            )
        },
    },
    Mutation: {
        // Event
        createEvent: (_, {data}, {pubsub, db}) => {
            const createdEvent = {
                id:nanoid(),
                ...data,
            }
            db.events.push(createdEvent);
            pubsub.publish("eventCreated",{eventCreated: createdEvent});
            return createdEvent;
        },
        updateEvent: (_, {id, data}, {db}) => {
            const event_index = db.events.findIndex(event => event.id == id);
            if(event_index===-1){
                throw new Error("Event is not found!");
            }

            const updatedEvent = {
                ...db.events[event_index],
                ...data,
            }
            return updatedEvent;
        },
        deleteEvent: (_, {id}, {db}) => {
            const event_index = db.events.findIndex(event => event.id== id);
            if(event_index===-1){
                throw new Error("Event is not found!");
            }

            const deletedEvent = db.events[event_index];
            db.events.splice(event_index,1);
            return deletedEvent;
        },
        deleteAllEvents: (_, __, {db}) => {
            const length= db.events.length;
            db.events.splice(0,length);
            return{
                count: length
            }
        },

        // Location
        createLocation: (_, {data}, {db}) => {
            const createdLocation = {
                id:nanoid(),
                ...data,
            }
            db.locations.push(createdLocation);
            return createdLocation;
        },
        updateLocation: (_, {id, data}, {db}) => {
            const location_index = db.locations.findIndex(location => location.id == id);
            if(location_index===-1){
                throw new Error("Location is not found!");
            }

            const updatedLocation = {
                ...db.locations[location_index],
                ...data,
            }
            return updatedLocation;
        },
        deleteLocation: (_, {id}, {db}) => {
            const location_index = db.locations.findIndex(location => location.id== id);
            if(location_index===-1){
                throw new Error("Location is not found!");
            }

            const deletedLocation = db.locations[location_index];
            db.locations.splice(location_index,1);
            return deletedLocation;
        },
        deleteAllLocations: (_, __, {db}) => {
            const length= db.locations.length;
            db.locations.splice(0,length);
            return{
                count: length
            }
        },

        // User
        createUser: (_, {data}, {pubsub, db}) => {
            const createdUser = {
                id:nanoid(),
                ...data,
            }
            db.users.push(createdUser);
            pubsub.publish("userCreated",{userCreated: createdUser});
            return createdUser;
        },
        updateUser: (_, {id, data}, {db}) => {
            const user_index = db.users.findIndex(user => user.id == id);
            if(user_index===-1){
                throw new Error("User is not found!");
            }

            const updatedUser = {
                ...db.users[user_index],
                ...data,
            }
            return updatedUser;
        },
        deleteUser: (_, {id}, {db}) => {
            const user_index = db.users.findIndex(user => user.id== id);
            if(user_index===-1){
                throw new Error("User is not found!");
            }

            const deletedUser = db.users[user_index];
            db.users.splice(user_index,1);
            return deletedUser;
        },
        deleteAllUsers: (_, __, {db}) => {
            const length= db.users.length;
            db.users.splice(0,length);
            return{
                count: length
            }
        },

        // Participant
        createParticipant: (_, {data},{pubsub, db}) => {
            const createdParticipant = {
                id:nanoid(),
                ...data,
            }
            db.participants.push(createdParticipant);
            pubsub.publish("participantCreated",{participantCreated: createdParticipant})
            return createdParticipant;
        },
        updateParticipant: (_, {id, data}, {db}) => {
            const participant_index = db.participants.findIndex(participant => participant.id == id);
            if(participant_index===-1){
                throw new Error("Participant is not found!");
            }

            const updatedParticipant = {
                ...db.participants[participant_index],
                ...data,
            }
            return updatedParticipant;
        },
        deleteParticipant: (_, {id}, {db}) => {
            const participant_index = db.participants.findIndex(participant => participant.id== id);
            if(participant_index===-1){
                throw new Error("Participant is not found!");
            }

            const deletedParticipant = db.participants[participant_index];
            db.participants.splice(participant_index,1);
            return deletedParticipant;
        },
        deleteAllParticipants: (_, __, {db}) => {
            const length= db.participants.length;
            db.participants.splice(0,length);
            return{
                count: length
            }
        },
    },
    Query: {
        events: (_, __, {db}) => db.events,
        event: (_,args, {db}) => db.events.find((event)=> event.id == args.id),

        locations: (_, __, {db}) => db.locations,
        location: (_,args, {db}) => db.locations.find((location)=> location.id == args.id),

        users: (_, __, {db}) => db.users,
        user: (_,args, {db}) => db.users.find((user)=> user.id == args.id),

        participants: (_, __, {db}) => db.participants,
        participant: (_,args, {db}) => db.participants.find((participant)=> participant.id == args.id),
    },
    Event: {
        user: (parent, __, {db}) => db.users.find((user) => user.id == parent.user_id),
        participants: (parent, __, {db}) => db.participants.filter((participant) => participant.event_id == parent.id),
        location: (parent, __, {db}) => db.locations.find((location) => location.id == parent.location_id),
    },
    Participant: {
        user: (parent, __, {db}) => db.users.find((user) => user.id == parent.user_id)
    },
};

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
