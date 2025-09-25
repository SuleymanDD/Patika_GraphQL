export const User = {
    posts: (parent, args, {db}) => {
        let filtered = db.posts.filter((post) => post.user_id === parent.id);

        if (args.filter) {
            filtered = db.filtered.filter((post) => post.title.toLowerCase().startsWith(args.filter.toLowerCase()))
        }

        return filtered;
    },
    comments: (parent,__,{db}) => db.comments.filter((comment) => comment.user_id === parent.id),
}
