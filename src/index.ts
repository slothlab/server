// const cors = require('micro-cors')(); // highlight-line
import Cors from 'micro-cors'
import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello GraphQL'
    }
};

const cors = Cors()

const apolloServer = new ApolloServer({ typeDefs, resolvers });
module.exports = cors(apolloServer.createHandler());
