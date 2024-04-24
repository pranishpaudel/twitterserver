"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../../clients/db/index");
const jwt_1 = __importDefault(require("../../services/jwt"));
//prime and composit
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const googleoauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleoauthURL.searchParams.set("id_token", token);
        const data = yield axios_1.default.get(googleoauthURL.toString());
        const googleResponse = data.data;
        const user = yield index_1.prismaClient.user.findUnique({
            where: { email: googleResponse.email },
        });
        if (!user) {
            yield index_1.prismaClient.user.create({
                data: {
                    email: googleResponse.email,
                    firstName: googleResponse.given_name,
                    lastName: googleResponse.family_name,
                    profileImageURL: googleResponse.azp,
                },
            });
        }
        const accessToken = yield jwt_1.default.generateTokenForUser(user.id);
        return accessToken;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(ctx);
        return ctx.user;
    }),
};
exports.resolvers = { queries };
