import { Request, Response } from "express";
import { login } from "../services/authService";

export const loginController = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    // Chamar o service de autenticação
    const { token, usuario } = await login(email, senha);
    res.json({ token, usuario }); // Retornar o token gerado
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Erro ao fazer login" });
    }
  }
};

export const verifyTokenController = async (req: Request, res: Response) => {
  // Se chegou aqui, significa que o token é válido (verificado pelo middleware)
  res.json({ valid: true });
};
