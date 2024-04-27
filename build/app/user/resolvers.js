import axios from "axios";
import { prismaClient } from "../../clients/db/index.js";
import JWTService from "../../services/jwt.js";
//prime and composit
const queries = {
    verifyGoogleToken: async (parent, { token }) => {
        console.log(token);
        const googleoauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleoauthURL.searchParams.set("id_token", token);
        const data = await axios.get(googleoauthURL.toString());
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
        const accessToken = await JWTService.generateTokenForUser(user.id);
        return accessToken;
    },
    getCurrentUser: async (parent, args, ctx) => {
        const id = ctx.user?.id;
        const user = await prismaClient.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    },
};
export const resolvers = { queries };
