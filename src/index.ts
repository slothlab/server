// const cors = require('micro-cors')(); // highlight-line
import { send } from 'micro'
import Cors from 'micro-cors'
import { get, post, router, options } from 'microrouter'
import { ApolloServer, gql } from 'apollo-server-micro'
import { resolvers } from './resolvers'

const typeDefs = gql`
    type Mutation {
        signUp(name: String!, email: String!, password: String!): User
    }

    type Query {
        hello(name: String!): String
        me(name: String!): String
        log: String
        user(id: Int!): User
        users: [User]
    }

    type User {
        id: Int
        name: String
        email: String
    }
`;

const graphqlPath = '/graphql'
const cors = Cors({
    allowMethods: ['GET', 'POST']
})

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const graphqlHandler = apolloServer.createHandler({ path: graphqlPath })

module.exports = cors(router(
    post(graphqlPath, graphqlHandler),
    get(graphqlPath, graphqlHandler),
    // to respond with a preflight request
    options(graphqlPath, (_, res) => send(res, 200)),
    (_, res) => send(res, 404, 'Not Found'),
))
// module.exports = cors(apolloServer.createHandler());
// module.exports = apolloServer.createHandler();
