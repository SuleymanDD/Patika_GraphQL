import { nanoid } from "nanoid";

export const Mutation = {
    // Post
    createPost: (_, { data }, { pubsub, db}) => {
        const post = {
            id: nanoid(),
            ...data,
        }

        db.posts.unshift(post);
        pubsub.publish("postCreated", { postCreated: post });
        pubsub.publish("postCount", { postCount: db.posts.length });
        return post;
    },
    updatePost: (_, { id, data }, { pubsub, db }) => {
        const post_index = db.posts.findIndex((post) => post.id === id);

        if (post_index === -1) {
            throw new Error("Post is not found!");
        }

        const updatedPost = {
            ...db.posts[post_index],
            ...data,
        }
        pubsub.publish("postUpdated", { postUpdated: updatedPost });
        return updatedPost;
    },
    deletePost: (_, { id }, { pubsub, db }) => {
        const post_index = db.posts.findIndex(post => post.id === id);

        if (post_index === -1) {
            throw new Error("Post is not found!");
        }

        const deletedPost = db.posts[post_index];
        db.posts.splice(post_index, 1);
        pubsub.publish("postDeleted", { postDeleted: deletedPost });
        pubsub.publish("postCount", { postCount: db.posts.length });
        return deletedPost;
    },
    deleteAllPosts: (_, __, { pubsub, db }) => {
        const length = db.posts.length;
        db.posts.splice(0, length);

        pubsub.publish("postCount", { postCount: db.posts.length });
        return { count: length }
    },

    // User
    createUser: async(_, { data }, { pubsub, _db }) => {
        const newUser = new _db.User({
            ...data,
        })

        const user = await newUser.save();
        pubsub.publish("userCreated", { userCreated: user });

        return user;
    },
    updateUser: async(_, { id, data }, { pubsub, _db }) => {
        const is_user_exists = await _db.User.findById(id)

        if (!is_user_exists) {
            throw new Error("User is not found!");
        }

        const updatedUser = await _db.User.findByIdAndUpdate(id,data,{
            new: true,
        })
        
        pubsub.publish("userUpdated", { userUpdated: updatedUser });
        return updatedUser;
    },
    deleteUser: async(_, { id }, { pubsub, _db }) => {
        const is_user_exists = await _db.User.findById(id)

        if (!is_user_exists) {
            throw new Error("User is not found!");
        }

        const deletedUser = await _db.User.findByIdAndDelete(id);

        pubsub.publish("userDeleted", { userDeleted: deletedUser });
        return deletedUser;
    },
    deleteAllUsers: async(_, __, { _db }) => {
        const deletedUsers = await _db.User.deleteMany({}); 

        return { count: deletedUsers.deletedCount }
    },

    // Comment
    createComment: (_, { data }, { pubsub, db }) => {
        const comment = {
            id: nanoid(),
            ...data,
        }

        db.comments.push(comment);
        pubsub.publish("commentCreated", { commentCreated: comment });
        return comment;
    },
    updateComment: (_, { id, data }, { pubsub, db }) => {
        const comment_index = db.comments.findIndex((comment) => comment.id === id);

        if (comment_index === -1) {
            throw new Error("Comment is not found!");
        }

        const updatedComment = {
            ...db.comments[comment_index],
            ...data,
        }
        pubsub.publish("commentUpdated", { commentUpdated: updatedComment });
        return updatedComment;
    },
    deleteComment: (_, { id }, { pubsub, db }) => {
        const comment_index = db.comments.findIndex(comment => comment.id === id);

        if (comment_index === -1) {
            throw new Error("Comment is not found!");
        }

        const deletedComment = db.comments[comment_index];
        db.comments.splice(comment_index, 1);
        pubsub.publish("commentDeleted", { commentDeleted: deletedComment });
        return deletedComment;
    },
    deleteAllComments: (_, __, { db }) => {
        const length = db.comments.length;
        db.comments.splice(0, length);

        return { count: length }
    },
}