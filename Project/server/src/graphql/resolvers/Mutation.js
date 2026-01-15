import { nanoid } from "nanoid";

export const Mutation = {
    // Post
    createPost: async (_, { data }, { pubsub, _db}) => {
        const newPost = new _db.Post({
            ...data,
        })

        const post = await newPost.save();
        const postCount = await _db.Post.countDocuments();

        const user= await _db.User.findById(data.user.toString());
        user.posts.push(post.id);
        user.save();

        pubsub.publish("postCreated", { postCreated: post });
        pubsub.publish("postCount", { postCount });
        return post;
    },
    updatePost: async (_, { id, data }, { pubsub, _db }) => {
        const is_post_exists = await _db.Post.findById(id)

        if (!is_post_exists) {
            throw new Error("Post is not found!");
        }

        const updatedPost = await _db.Post.findByIdAndUpdate(id,data,{
            new: true,
        })

        pubsub.publish("postUpdated", { postUpdated: updatedPost });
        return updatedPost;
    },
    deletePost: async (_, { id }, { pubsub, _db }) => {
        const is_post_exists = await _db.Post.findById(id)

        if (!is_post_exists) {
            throw new Error("Post is not found!");
        }

        const deletedPost = await _db.Post.findByIdAndDelete(id);
        const postCount = await _db.Post.countDocuments();

        pubsub.publish("postDeleted", { postDeleted: deletedPost });
        pubsub.publish("postCount", { postCount });
        return deletedPost;
    },
    deleteAllPosts: async (_, __, { pubsub, _db }) => {
        const deletedPosts = await _db.Post.deleteMany({}); 

        pubsub.publish("postCount", { postCount: deletedPosts.deletedCount });

        return { count: deletedPosts.deletedCount };
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
    createComment: async(_, { data }, { pubsub, _db }) => {
        const comment = new _db.Comment(data);
        const createdComment = await comment.save();
        
        const user = await _db.User.findById(data.user.toString());
        const post = await _db.Post.findById(data.post.toString());

        user.comments.push(comment.id);
        post.comments.push(comment.id);

        await user.save();
        await post.save();

        pubsub.publish("commentCreated", { commentCreated: createdComment });
        return createdComment;
    },
    updateComment: async (_, { id, data }, { pubsub, _db }) => {
        const is_comment_exists = await _db.Comment.findById(id)

        if (!is_comment_exists) {
            throw new Error("Comment is not found!");
        }

        const updatedComment = await _db.Comment.findByIdAndUpdate(id,data,{
            new: true,
        })

        pubsub.publish("commentUpdated", { commentUpdated: updatedComment });
        return updatedComment;
    },
    deleteComment: async(_, { id }, { pubsub, _db }) => {
        const is_comment_exists = await _db.Comment.findById(id)

        if (!is_comment_exists) {
            throw new Error("Comment is not found!");
        }

        const deletedComment = await _db.Comment.findByIdAndDelete(id);

        pubsub.publish("commentDeleted", { commentDeleted: deletedComment });
        return deletedComment;
    },
    deleteAllComments: async (_, __, { _db }) => {
        const deletedComments = await _db.Comment.deleteMany({}); 

        return { count: deletedComments.deletedCount };
    },
}