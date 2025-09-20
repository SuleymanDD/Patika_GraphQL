const { nanoid } = require("nanoid");

const Mutation = {
    // Book
    createBook: (_, { data }, { pubsub, db}) => {
        const book = {
            id: nanoid(),
            ...data,
        }

        db.books.push(book);
        pubsub.publish("bookCreated", { bookCreated: book });
        pubsub.publish("bookCount", { bookCount: db.books.length });
        return book;
    },
    updateBook: (_, { id, data }, { pubsub, db }) => {
        const book_index = db.books.findIndex((book) => book.id === id);

        if (book_index === -1) {
            throw new Error("Book is not found!");
        }

        const updatedBook = {
            ...db.books[book_index],
            ...data,
        }
        pubsub.publish("bookUpdated", { bookUpdated: updatedBook });
        return updatedBook;
    },
    deleteBook: (_, { id }, { pubsub, db }) => {
        const book_index = db.books.findIndex(book => book.id === id);

        if (book_index === -1) {
            throw new Error("Book is not found!");
        }

        const deletedBook = db.books[book_index];
        db.books.splice(book_index, 1);
        pubsub.publish("bookDeleted", { bookDeleted: deletedBook });
        pubsub.publish("bookCount", { bookCount: db.books.length });
        return deletedBook;
    },
    deleteAllBooks: (_, __, { pubsub, db }) => {
        const length = db.books.length;
        db.books.splice(0, length);

        pubsub.publish("bookCount", { bookCount: db.books.length });
        return { count: length }
    },

    // Author
    createAuthor: (_, { data }, { pubsub, db }) => {
        const author = {
            id: nanoid(),
            ...data,
        }

        db.authors.push(author);
        pubsub.publish("authorCreated", { authorCreated: author });
        return author;
    },
    updateAuthor: (_, { id, data }, { pubsub, db }) => {
        const author_index = db.authors.findIndex((author) => author.id === id);

        if (author_index === -1) {
            throw new Error("Author is not found!");
        }

        const updatedAuthor = {
            ...db.authors[author_index],
            ...data,
        }
        pubsub.publish("authorUpdated", { authorUpdated: updatedAuthor });
        return updatedAuthor;
    },
    deleteAuthor: (_, { id }, { pubsub, db }) => {
        const author_index = db.authors.findIndex(author => author.id === id);

        if (author_index === -1) {
            throw new Error("Author is not found!");
        }

        const deletedAuthor = db.authors[author_index];
        db.authors.splice(author_index, 1);
        pubsub.publish("authorDeleted", { authorDeleted: deletedAuthor });
        return deletedAuthor;
    },
    deleteAllAuthors: (_, __, { db }) => {
        const length = db.authors.length;
        db.authors.splice(0, length);

        return { count: length }
    },
}

module.exports.Mutation = Mutation;