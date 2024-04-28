import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./user/index.js";
import { Tweet } from "./tweet/index.js";
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
       ${Tweet.types}
        type Query {
          ${User.queries}
          ${Tweet.query}
        }
        type Mutation{
          ${Tweet.mutations}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
      },
      ...Tweet.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
    },
  });

  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const extractedJWT = req.headers.authorization.split("Bearer ")[1];
        if (
          (!extractedJWT && extractedJWT.length === 0) ||
          extractedJWT === null
        ) {
          return {
            user: undefined,
          };
        }
        return {
          user: extractedJWT ? JWTService.decodeToken(extractedJWT) : undefined,
        };
      },
    })
  );

  return app;
}
