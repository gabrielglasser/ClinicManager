import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Gerar token JWT
export const gerarToken = (usuario: { id: string; email: string }) => {
  return jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET as string, {
    expiresIn: '1h', // Token expira em 1 hora
  });
};

// Login de usuário
export const login = async (email: string, senha: string) => {
  // Buscar usuário pelo email
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }

  // Verificar a senha (comparar com bcrypt)
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw new Error('Senha incorreta.');
  }

  // Gerar token JWT
  const token = gerarToken(usuario);

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      tipo: usuario.tipo,
      photo: usuario.photo,
    },
  };
};