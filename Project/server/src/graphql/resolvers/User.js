export const User = {
    posts: async(parent, args, {_db}) => {
        let filtered = await _db.Post.find({ user: parent.id});

        if (args.filter) {
            filtered = _db.filtered.filter((post) => post.title.toLowerCase().startsWith(args.filter.toLowerCase()))
        }

        return filtered;
    },
    comments: async(parent,__,{_db}) =>await _db.Comment.find({user: parent.id}),
}
