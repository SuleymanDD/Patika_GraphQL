const {ApolloServer , gql} = require("apollo-server");
const { nanoid } = require("nanoid");

const {books, authors} = require("./data");

const typeDefs = gql`
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

        # Author
        createAuthor(data: CreateAuthorInput!): Author!
        updateAuthor(id: ID!, data: UpdateAuthorInput!): Author!
    }
`;

const resolvers = {
    Mutation: {
        // Book
        createBook: (parent, {data}) => {
            const book = {
                id: nanoid(),
                ...data,
            }

            books.push(book);
            return book;
        },
        updateBook: (parent, {id, data}) => {
            const book_index = books.findIndex((book) => book.id === id);

            if(book_index === -1){
                throw new Error("Book is not found!");
            }

            const updatedBook= {
                ...books[book_index],
                ...data,
            }
            return updatedBook;
        },
        deleteBook: (parent, {id}) => {
            const book_index = books.findIndex(book => book.id===id);

            if(book_index===-1){
                throw new Error("Book is not found!");
            }

            const deletedBook = books[book_index];
            books.splice(book_index,1);
            return deletedBook;
        },

        // Author
        createAuthor: (parent, {data}) => {
            const author= {
                id: nanoid(),
                ...data,
            }

            authors.push(author);
            return author;
        },
        updateAuthor: (parent, {id, data}) => {
            const author_index = authors.findIndex((author) => author.id === id);

            if(author_index === -1){
                throw new Error("Author is not found!");
            }

            const updatedAuthor= {
                ...authors[author_index],
                ...data,
            }
            return updatedAuthor;
        }
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
server.listen().then(({url}) => {console.log(`Apollo serve is up at ${url}`)});
