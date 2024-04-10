import { prismaClient } from "../clients/db/index.js";
import JWT from "jsonwebtoken";

const JWT_SECRET = "sadD#ASDASD4234234234234";
class JWTService {
  public static async generateTokenForUser(userId: string) {
    const user = await prismaClient.user.findUnique({ where: { id: userId } });

    const payload = {
      id: user?.id,
      email: user?.email,
    };
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
  }
}

export default JWTService;
