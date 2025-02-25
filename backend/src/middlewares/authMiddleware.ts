import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '@prisma/client'; // Importe o tipo Usuario do Prisma

interface TokenPayload {
  id: string;
  email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // Verificar o token JWT e fazer o casting para TokenPayload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    // Atribuir apenas as informações necessárias ao req.usuario
    req.usuario = { id: decoded.id, email: decoded.email } as Usuario;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

export default authMiddleware;