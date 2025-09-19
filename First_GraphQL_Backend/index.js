const {GraphQLServer, PubSub, withFilter} = require("graphql-yoga");
const { nanoid } = require("nanoid");

const {books, authors} = require("./data");

const typeDefs = `
    type Book {
        id: ID!
        title: String!
        author: Author
        author_id: String!
        score: Float
        isPublished: Boolean
    }

    input CreateBookInput{
        title: String!, author_id: ID!, score: Float!, isPublished: Boolean!
    }
    input UpdateBookInput{
        title: String, author_id: ID, score: Float, isPublished: Boolean
    }

    type Author {
        id: ID!
        name: String!
        surname: String
        age:Int
        books(filter: String): [Book!]
    }
    
    input CreateAuthorInput{
        name: String!, surname: String!, age: Int!
    }
    input UpdateAuthorInput{
        name: String, surname: String, age: Int
    }

    type DeleteAllOutput{
        count: Int
    }


    type Query {
        # Book
        books: [Book!]
        book(id: ID!): Book!

        # Author
        authors: [Author!]
        author(id: ID!): Author!
    }
    
    type Mutation {
        # Book
        createBook(data: CreateBookInput!): Book!
        updateBook(id: ID!, data: UpdateBookInput!): Book!
        deleteBook(id: ID!): Book!
        deleteAllBooks: DeleteAllOutput!

        # Author
        createAuthor(data: CreateAuthorInput!): Author!
        updateAuthor(id: ID!, data: UpdateAuthorInput!): Author!
        deleteAuthor(id: ID!): Author!
        deleteAllAuthors: DeleteAllOutput!
    }

    type Subscription{
        # Book
        bookCreated(author_id: ID!): Book!
        bookUpdated: Book!
        bookDeleted: Book!
        bookCount: Int!

        # Author
        authorCreated: Author!
        authorUpdated: Author!
        authorDeleted: Author!
    }
`;

const resolvers = {
    Subscription: {
        // Book
        bookCreated: {
            subscribe: withFilter(
                (_,__,{pubsub}) => pubsub.asyncIterator("bookCreated"),
                (payload, variables) => {
                    return variables.author_id ? (payload.bookCreated.author_id === variables.author_id) : true;
                }
            )
        },
        bookUpdated: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("bookUpdated"),  
        },
        bookDeleted: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("bookDeleted"),  
        },
        bookCount: {
            subscribe: (_,__,{pubsub}) => {
                setTimeout(() => {
                    pubsub.publish("bookCount", {bookCount: books.length})
                });
                return pubsub.asyncIterator("bookCount")
            },
        },

        // Author
        authorCreated: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("authorCreated"),  
        },
        authorUpdated: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("authorUpdated"),  
        },
        authorDeleted: {
            subscribe: (_,__,{pubsub}) => pubsub.asyncIterator("authorDeleted"),  
        },
    },
    Mutation: {
        // Book
        createBook: (_, {data}, {pubsub}) => {
            const book = {
                id: nanoid(),
                ...data,
            }

            books.push(book);
            pubsub.publish("bookCreated", {bookCreated: book});
            pubsub.publish("bookCount", {bookCount: books.length});
            return book;
        },
        updateBook: (_, {id, data}, {pubsub}) => {
            const book_index = books.findIndex((book) => book.id === id);

            if(book_index === -1){
                throw new Error("Book is not found!");
            }

            const updatedBook= {
                ...books[book_index],
                ...data,
            }
            pubsub.publish("bookUpdated", {bookUpdated: updatedBook});
            return updatedBook;
        },
        deleteBook: (_, {id}, {pubsub}) => {
            const book_index = books.findIndex(book => book.id===id);

            if(book_index===-1){
                throw new Error("Book is not found!");
            }

            const deletedBook = books[book_index];
            books.splice(book_index,1);
            pubsub.publish("bookDeleted", {bookDeleted: deletedBook});
            pubsub.publish("bookCount", {bookCount: books.length});
            return deletedBook;
        },
        deleteAllBooks: (_, __, {pubsub}) => {
            const length = books.length;
            books.splice(0,length);

            pubsub.publish("bookCount", {bookCount: books.length});
            return {count: length}
        },

        // Author
        createAuthor: (_, {data}, {pubsub}) => {
            const author= {
                id: nanoid(),
                ...data,
            }

            authors.push(author);
            pubsub.publish("authorCreated", {authorCreated: author});
            return author;
        },
        updateAuthor: (_, {id, data}, {pubsub}) => {
            const author_index = authors.findIndex((author) => author.id === id);

            if(author_index === -1){
                throw new Error("Author is not found!");
            }

            const updatedAuthor= {
                ...authors[author_index],
                ...data,
            }
            pubsub.publish("authorUpdated", {authorUpdated: updatedAuthor});
            return updatedAuthor;
        },
        deleteAuthor: (_, {id}, {pubsub}) => {
            const author_index = authors.findIndex(author => author.id===id);

            if(author_index === -1){
                throw new Error("Author is not found!");
            }

            const deletedAuthor = authors[author_index];
            authors.splice(author_index,1);
            pubsub.publish("authorDeleted", {authorDeleted: deletedAuthor});
            return deletedAuthor;
        },
        deleteAllAuthors: (_, __) => {
            const length = authors.length;
            authors.splice(0,length);

            return {count: length}
        },
    },
    Query: {
        books: () => books,
        book: (parent, args) => books.find((book) =>  book.id === args.id),

        authors: () => authors,
        author: (parent, args) => authors.find((author) => author.id === args.id),
    },
    Book: {
        author: (parent) => authors.find((author) => author.id === parent.author_id),
    },
    Author: {
        books: (parent, args) => {
            let filtered = books.filter((book) => book.author_id === parent.id);

            if(args.filter) {
                filtered = filtered.filter((book) => book.title.toLowerCase().startsWith(args.filter.toLowerCase()))
            }

            return filtered;
        }
    },
};

const pubsub = new PubSub();
const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});

server.start(() =>console.log(`Server is started on localhost:4000`) )
