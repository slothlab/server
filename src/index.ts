import { send } from 'micro'
import Cors from 'micro-cors'
import { get, post, router, options } from 'microrouter'
import { ApolloServer, gql } from 'apollo-server-micro'
import { resolvers } from './resolvers'

const typeDefs = gql`
    type Mutation {
        signUp(name: String!, email: String!, password: String!): User
        authenticateUser(email: String!, password: String!): Token
        createTodo(title: String!): Todo
        toggleTodo(id: Int!, completed: Boolean): Todo
        removeTodo(id: Int!): Todo
        saveHappiness(happiness: Int!, question: Int!, value: Int!): Answers
    }

    type Query {
        hello(name: String!): String
        me(name: String!): String
        log: String
        user(id: Int!): User
        users: [User],
        today: [Todo],
        yesterday: [Todo],
        tomorrow: [Todo],
        getUserToday(user: String!): [Todo]
        getAllHappiness: [Happiness]
        happiness(id: Int!): Happiness
    }

    type ID {
        id: Int!
    }

    enum QuestionTypeEnum {
        number
        boolean
        string
    }

    type Token {
        id: String!
        token: String!
    }

    type User {
        id: Int!
        name: String
        email: String
    }

    type Todo {
        id: Int!
        title: String!
        completed: Boolean!
        createdAt: String
    }

    type Happiness {
        id: Int!
        title: String!
        questions: [Questions]
        createdAt: String
    }

    type Questions {
        id: Int!
        title: String!
        type: String!
    }

    type Answer {
        id: Int!
        value: Int!
    }

    type Answers {
        answers: [Answer]
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