export const Author = {
    books: (parent, args, {db}) => {
        let filtered = db.books.filter((book) => book.author_id === parent.id);

        if (args.filter) {
            filtered = db.filtered.filter((book) => book.title.toLowerCase().startsWith(args.filter.toLowerCase()))
        }

        return filtered;
    }
}