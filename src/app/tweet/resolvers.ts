import { prismaClient } from "../../clients/db/index.js";
import { GraphqlContext } from "../../interfaces.js";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
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
    author: async (parent: any) => {
      return await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};
export const resolvers = { mutations, extraResolvers, queries };
