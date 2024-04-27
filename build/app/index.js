import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./user/index.js";
import cors from "cors";
import JWTService from "../services/jwt.js";
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
    app.use("/graphql", expressMiddleware(server, {
        context: async ({ req, res }) => {
            const extractedJWT = req.headers.authorization.split("Bearer ")[1];
            return {
                user: extractedJWT ? JWTService.decodeToken(extractedJWT) : undefined,
            };
        },
    }));
    return app;
}
