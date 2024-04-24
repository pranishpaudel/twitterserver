import { prismaClient } from "../clients/db/index.js";
import JWT from "jsonwebtoken";
const JWT_SECRET = "sadD#ASDASD4234234234234";
class JWTService {
    static async generateTokenForUser(userId) {
        const user = await prismaClient.user.findUnique({ where: { id: userId } });
        const payload = {
            id: user?.id,
            email: user?.email,
        };
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }
    static decodeToken(token) {
        console.log(JWT.verify(token, JWT_SECRET));
        return JWT.verify(token, JWT_SECRET);
    }
}
export default JWTService;
