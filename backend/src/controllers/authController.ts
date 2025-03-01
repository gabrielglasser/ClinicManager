import { Request, Response } from 'express';
import { login } from '../services/authService';

export const loginController = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    // Chamar o service de autenticação
    const {token, usuario} = await login(email, senha);
    res.json({ token, usuario }); // Retornar o token gerado
  } catch (error) {
    res.status(400).json(error); // Retornar erro, se houver
  }
};