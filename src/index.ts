import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { prisma } from './generated/prisma-client';

const typeDefs = gql`
    type Todo {
        id: Int!
        title: String
    }

    type Query {
        todo(id: Int): Todo
        todoes(title: String): [Todo]
    }
`;

const resolvers = {
    Query: {
        todo: (_: any, { id }: { id: number}) => {
            return prisma.todo({ id });
        },
        todoes: (_: any, { title }: { title: string }) => {
            return prisma.todoes({ where: { title_contains: title }});
        },
    },
};

const server = new ApolloServer( { typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})