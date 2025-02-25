import { Usuario } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      usuario?: Pick<Usuario, 'id' | 'email'>; 
    }
  }
}