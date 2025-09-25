import {withFilter} from "graphql-subscriptions";

export const Subscription = {
    // Post
    postCreated: {
        subscribe: withFilter(
            (_, __, { pubsub }) => pubsub.asyncIterator("postCreated"),
            (payload, variables) => {
                return variables.user_id ? (payload.postCreated.user_id === variables.user_id) : true;
            }
        )
    },
    postUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("postUpdated"),
    },
    postDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("postDeleted"),
    },
    postCount: {
        subscribe: (_, __, { pubsub, db }) => {
            setTimeout(() => {
                pubsub.publish("postCount", { postCount: db.posts.length })
            });
            return pubsub.asyncIterator("postCount")
        },
    },

    // User
    userCreated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("userCreated"),
    },
    userUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("userUpdated"),
    },
    userDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("userDeleted"),
    },

    // Comment
    commentCreated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("commentCreated"),
    },
    commentUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("commentUpdated"),
    },
    commentDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("commentDeleted"),
    },
}