export const Query = {
    books: (_,__,{db}) => db.books,
    book: (_, args,{db}) => db.books.find((book) => book.id === args.id),

    authors: (_,__,{db}) => db.authors,
    author: (_, args,{db}) => db.authors.find((author) => author.id === args.id),
}