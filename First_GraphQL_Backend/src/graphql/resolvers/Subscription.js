const {withFilter} = require("graphql-yoga");

const Subscription = {
    // Book
    bookCreated: {
        subscribe: withFilter(
            (_, __, { pubsub }) => pubsub.asyncIterator("bookCreated"),
            (payload, variables) => {
                return variables.author_id ? (payload.bookCreated.author_id === variables.author_id) : true;
            }
        )
    },
    bookUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("bookUpdated"),
    },
    bookDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("bookDeleted"),
    },
    bookCount: {
        subscribe: (_, __, { pubsub, db }) => {
            setTimeout(() => {
                pubsub.publish("bookCount", { bookCount: db.books.length })
            });
            return pubsub.asyncIterator("bookCount")
        },
    },

    // Author
    authorCreated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("authorCreated"),
    },
    authorUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("authorUpdated"),
    },
    authorDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("authorDeleted"),
    },
}

module.exports = Subscription;