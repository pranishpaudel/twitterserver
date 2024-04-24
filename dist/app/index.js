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
exports.initServer = void 0;
const express4_1 = require("@apollo/server/express4");
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_js_1 = require("./user/index.js");
const cors_1 = __importDefault(require("cors"));
const jwt_js_1 = __importDefault(require("../services/jwt.js"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        const server = new server_1.ApolloServer({
            typeDefs: `#graphql
       ${index_js_1.User.types}
        type Query {
          ${index_js_1.User.queries}
        }
    `,
            resolvers: {
                Query: Object.assign({}, index_js_1.User.resolvers.queries),
            },
        });
        yield server.start();
        app.use("/graphql", (0, express4_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req, res }) {
                return {
                    user: req.headers.authorization
                        ? jwt_js_1.default.decodeToken(req.headers.authorization)
                        : undefined,
                };
            }),
        }));
        return app;
    });
}
exports.initServer = initServer;
