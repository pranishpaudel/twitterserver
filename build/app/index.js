import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./user/index.js";
import cors from "cors";
export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    const server = new ApolloServer({
        typeDefs: `#graphql
       ${User.types}
        type Query {
          ${User.queries}
        }
    `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
        },
    });
    await server.start();
    app.use("/graphql", expressMiddleware(server));
    return app;
}
