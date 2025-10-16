const {GraphQLServer, PubSub} = require("graphql-yoga");
const {nanoid} = require("nanoid");

const {events, locations, users, participants} = require("./data");

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
        title: String!, desc: String!, date: String!, from: String!, to: String!, location_id: ID!, user_id: ID!
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
    }

    input CreateParticipantInput{
        user_id: ID!, event_id: ID!
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
        eventCreated: Event!
        # Participant
        participantCreated: Participant!
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
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("participantCreated"),
        },
    },
    Mutation: {
        // Event
        createEvent: (_, {data}, {pubsub}) => {
            const createdEvent = {
                id:nanoid(),
                ...data,
            }
            events.push(createdEvent);
            pubsub.publish("eventCreated",{eventCreated: createdEvent});
            return createdEvent;
        },
        updateEvent: (_, {id, data}) => {
            const event_index = events.findIndex(event => event.id == id);
            if(event_index===-1){
                throw new Error("Event is not found!");
            }

            const updatedEvent = {
                ...events[event_index],
                ...data,
            }
            return updatedEvent;
        },
        deleteEvent: (_, {id}) => {
            const event_index = events.findIndex(event => event.id== id);
            if(event_index===-1){
                throw new Error("Event is not found!");
            }

            const deletedEvent = events[event_index];
            events.splice(event_index,1);
            return deletedEvent;
        },
        deleteAllEvents: (_, __) => {
            const length= events.length;
            events.splice(0,length);
            return{
                count: length
            }
        },

        // Location
        createLocation: (_, {data}) => {
            const createdLocation = {
                id:nanoid(),
                ...data,
            }
            locations.push(createdLocation);
            return createdLocation;
        },
        updateLocation: (_, {id, data}) => {
            const location_index = locations.findIndex(location => location.id == id);
            if(location_index===-1){
                throw new Error("Location is not found!");
            }

            const updatedLocation = {
                ...locations[location_index],
                ...data,
            }
            return updatedLocation;
        },
        deleteLocation: (_, {id}) => {
            const location_index = locations.findIndex(location => location.id== id);
            if(location_index===-1){
                throw new Error("Location is not found!");
            }

            const deletedLocation = locations[location_index];
            locations.splice(location_index,1);
            return deletedLocation;
        },
        deleteAllLocations: (_, __) => {
            const length= locations.length;
            locations.splice(0,length);
            return{
                count: length
            }
        },

        // User
        createUser: (_, {data}, {pubsub}) => {
            const createdUser = {
                id:nanoid(),
                ...data,
            }
            users.push(createdUser);
            pubsub.publish("userCreated",{userCreated: createdUser});
            return createdUser;
        },
        updateUser: (_, {id, data}) => {
            const user_index = users.findIndex(user => user.id == id);
            if(user_index===-1){
                throw new Error("User is not found!");
            }

            const updatedUser = {
                ...users[user_index],
                ...data,
            }
            return updatedUser;
        },
        deleteUser: (_, {id}) => {
            const user_index = users.findIndex(user => user.id== id);
            if(user_index===-1){
                throw new Error("User is not found!");
            }

            const deletedUser = users[user_index];
            users.splice(user_index,1);
            return deletedUser;
        },
        deleteAllUsers: (_, __) => {
            const length= users.length;
            users.splice(0,length);
            return{
                count: length
            }
        },

        // Participant
        createParticipant: (_, {data},{pubsub}) => {
            const createdParticipant = {
                id:nanoid(),
                ...data,
            }
            participants.push(createdParticipant);
            pubsub.publish("participantCreated",{participantCreated: createdParticipant})
            return createdParticipant;
        },
        updateParticipant: (_, {id, data}) => {
            const participant_index = participants.findIndex(participant => participant.id == id);
            if(participant_index===-1){
                throw new Error("Participant is not found!");
            }

            const updatedParticipant = {
                ...participants[participant_index],
                ...data,
            }
            return updatedParticipant;
        },
        deleteParticipant: (_, {id}) => {
            const participant_index = participants.findIndex(participant => participant.id== id);
            if(participant_index===-1){
                throw new Error("Participant is not found!");
            }

            const deletedParticipant = participants[participant_index];
            participants.splice(participant_index,1);
            return deletedParticipant;
        },
        deleteAllParticipants: (_, __) => {
            const length= participants.length;
            participants.splice(0,length);
            return{
                count: length
            }
        },
    },
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
const pubsub = new PubSub();
const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});

server.start(() =>console.log(`Server is started on localhost:4000`) )