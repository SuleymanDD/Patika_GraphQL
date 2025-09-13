const {ApolloServer , gql} = require("apollo-server");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core");

const author = {
    id: "1",
    name:"Ahmed",
    surname: "Mitrovic",
    age: 21,
    books: [
        {
            id: "1",
            title: "Domuz Emi",
            score: 3.2,
            isPublished: false
        },
        {
            id: "2",
            title: "Elas Keas",
            score: 9,
            isPublished: true
        }
    ]
}
const book ={
    id: "jkdsf7as912b",
    title: "Şeker Portakalı",
    author,
    score: 7.5,
    isPublished: true
};

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
        book: Book
        author: Author
    }
`;

const resolvers = {
    Query: {
        book: () => book,
        author: () => author
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
