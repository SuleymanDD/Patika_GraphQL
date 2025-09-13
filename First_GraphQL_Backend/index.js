const {ApolloServer , gql} = require("apollo-server");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core");

const {books, authors} = require("./data");

const typeDefs = gql`
    type Author {
        id: ID!
        name: String!
        surname: String
        age:Int
        books: [Book!]
    }

    type Book {
        id: ID!
        title: String!
        author: Author
        score: Float
        isPublished: Boolean
    }

    type Query {
        books: [Book!]
        book(id: ID!): Book!
        authors: [Author!]
        author(id: ID!): Author!
    }
`;

const resolvers = {
    Query: {
        books: () => books,
        book: (parent, args) => {
            const data = books.find((book) =>  book.id === args.id);
            return data;
        },
        authors: () => authors,
        author: (parent, args) => {
            const data = authors.find((author) => author.id === args.id);
            return data;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
            //OPTİONS
        }),
    ],
});
server.listen().then(({url}) => {console.log(`Apollo serve is up at ${url}`)});
