import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: {
    id: string;
    type: string;
  };
}

export function ensureRole(roles: string[]) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log("Usuário autenticado:", req.user); 

    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!roles.includes(req.user.type)) {
      return res.status(403).json({ error: "Acesso negado: Usuário sem permissão" });
    }

    next();
  };
}
