import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  password: string;
  type: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User/Password incorrect");
    }

    //verificar se a senha esta correta
    const passwordMatch = await compare(password, user.senha);

    if (!passwordMatch) {
      throw new Error("User/Password incorrect");
    }

    //gerar token com JWT
    const token = sign(
      {
        id: user.id,
        name: user.nome,
        type: user.tipo,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "30d",
      }
    );

    return { id: user.id, name: user.nome, email: user.email, type: user.tipo, token: token };
  }
}

export { AuthUserService };
