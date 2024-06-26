import axios from "axios";
import { prismaClient } from "../../clients/db/index.js";
import JWTService from "../../services/jwt.js";
import { GraphqlContext } from "../../interfaces.js";

interface AxiosGoogleType {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}
//prime and composit
const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    console.log(token);
    const googleoauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleoauthURL.searchParams.set("id_token", token);
    const data = await axios.get<AxiosGoogleType>(googleoauthURL.toString());
    const googleResponse = data.data;

    const user = await prismaClient.user.findUnique({
      where: { email: googleResponse.email },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          email: googleResponse.email,
          firstName: googleResponse.given_name,
          lastName: googleResponse.family_name,
          profileImageURL: googleResponse.azp,
        },
      });
    }

    const accessToken = await JWTService.generateTokenForUser(user!.id);

    return accessToken;
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx.user?.id;
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  },
};

const extraResolvers = {
  User: {
    tweets: async (parent: any) => {
      console.log("I AM THE PARTENT", parent);
      return await prismaClient.tweet.findMany({
        where: {
          authorId: parent.id,
        },
      });
    },
  },
};
export const resolvers = { queries, extraResolvers };
