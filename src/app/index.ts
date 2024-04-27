import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./user/index.js";
import { Tweet } from "./tweet/index";
import { prismaClient } from "../clients/db/index.js";
import cors from "cors";
import { GraphqlContext } from "../interfaces.js";
import JWTService from "../services/jwt.js";
export async function initServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const server = new ApolloServer<GraphqlContext>({
    typeDefs: `#graphql
       ${User.types}
        type Query {
          ${User.queries}
        }
        type Mutation{
          ${Tweet.mutations}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
      },
    },
  });

  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const extractedJWT = req.headers.authorization.split("Bearer ")[1];
        return {
          user: extractedJWT ? JWTService.decodeToken(extractedJWT) : undefined,
        };
      },
    })
  );

  return app;
}
