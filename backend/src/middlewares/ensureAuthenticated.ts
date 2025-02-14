import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  id: string;
  type: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
     res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log("Token decodificado:", decoded);

    if (!decoded.id || !decoded.type) {
       res.status(401).json({ error: "Token inválido ou malformado" });
    }

    req.user = {
      id: decoded.id,
      type: decoded.type
    };

    next();
  } catch (error) {
     res.status(401).json({ error: "Token inválido" });
  }
}

