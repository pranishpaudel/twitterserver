import { prismaClient } from "../clients/db/index.js";
import JWT from "jsonwebtoken";
import { JWTUser } from "../interfaces.js";

const JWT_SECRET = "sadD#ASDASD4234234234234";
class JWTService {
  public static async generateTokenForUser(userId: string) {
    const user = await prismaClient.user.findUnique({ where: { id: userId } });

    const payload: JWTUser = {
      id: user!?.id,
      email: user!?.email,
    };
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
  }

  public static decodeToken(token: string) {
    console.log(JWT.verify(token, JWT_SECRET));
    return JWT.verify(token, JWT_SECRET) as JWTUser;
  }
}

export default JWTService;
