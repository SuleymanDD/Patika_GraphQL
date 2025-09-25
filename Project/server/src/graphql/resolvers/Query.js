export const Query = {
    posts: (_,__,{db}) => db.posts,
    post: (_, args,{db}) => db.posts.find((post) => post.id === args.id),

    users: (_,__,{db}) => db.users,
    user: (_, args,{db}) => db.users.find((user) => user.id === args.id),

    comments: (_,__,{db}) => db.comments,
    comment: (_, args,{db}) => db.comments.find((comment) => comment.id === args.id),
}