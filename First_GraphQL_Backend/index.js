const {ApolloServer , gql} = require("apollo-server");
const { nanoid } = require("nanoid");

const {books, authors} = require("./data");

const typeDefs = gql`
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

    type Book {
        id: ID!
        title: String!
        author: Author
        author_id: String!
        score: Float
        isPublished: Boolean
    }

    input CreateBookInput{
        title: String!, author_id: ID!, score: Float!, isPublished: Boolean
    }

    type Query {
        books: [Book!]
        book(id: ID!): Book!
        authors: [Author!]
        author(id: ID!): Author!
    }
    
    type Mutation {
        createBook(data: CreateBookInput!): Book!
        createAuthor(data: CreateAuthorInput!): Author!
    }
`;

const resolvers = {
    Mutation: {
        createBook: (parent, {data}) => {
            const book = {
                id: nanoid(),
                ...data,
            }

            books.push(book);
            return book;
        },
        createAuthor: (parent, {data}) => {
            const author= {
                id: nanoid(),
                ...data,
            }

            authors.push(author);
            return author;
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
