import { prismaClient } from "../../clients/db/index.js";
const mutations = {
    createTweet: async (parent, { payload }, ctx) => {
        if (!ctx.user) {
            throw new Error("Unauthorized");
        }
        const tweet = await prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } },
            },
        });
        return tweet;
    },
};
const queries = {
    getAllTweets: async () => {
        return await prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" },
        });
    },
};
const extraResolvers = {
    Tweet: {
        author: async (parent) => {
            return await prismaClient.user.findUnique({
                where: { id: parent.authorId },
            });
        },
    },
};
export const resolvers = { mutations, extraResolvers, queries };
