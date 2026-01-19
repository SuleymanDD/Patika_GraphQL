import { withFilter } from "graphql-subscriptions";

export const Subscription = {
    // Post
    postCreated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("postCreated"),
    },
    postUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("postUpdated"),
    },
    postDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("postDeleted"),
    },
    postCount: {
        subscribe: async (_, __, { pubsub, _db }) => {
            const postCount = await _db.Post.countDocuments();

            setTimeout(() => {
                pubsub.publish("postCount", { postCount })
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
        subscribe:withFilter(
            (_, __, { pubsub }) => pubsub.asyncIterator("commentCreated"),
            (payload, variables) => {
                return variables.post ? (payload.commentCreated.post === variables.post) : true;
            },
        ) 
    },
    commentUpdated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("commentUpdated"),
    },
    commentDeleted: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("commentDeleted"),
    },
}