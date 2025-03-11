import { PrismaClient, Usuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Criar um usuário
export const criarUsuario = async (data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>) => {
  const senhaCriptografada = await bcrypt.hash(data.senha, 10); // Criptografa a senha
  return prisma.usuario.create({ data: { ...data, senha: senhaCriptografada } });
};

// Buscar um usuário por ID
export const buscarUsuarioPorId = async (id: string) => {
  return prisma.usuario.findUnique({ where: { id } });
};

// Buscar todos os usuários
export const listarUsuarios = async () => {
  return await prisma.usuario.findMany();
};

// Atualizar um usuário
export const atualizarUsuario = async (id: string, data: Partial<Usuario>) => {
  if (data.senha) {
    data.senha = await bcrypt.hash(data.senha, 10);
  }

  return prisma.usuario.update({
    where: { id },
    data,
  });
};
// Deletar um usuário
export const deletarUsuario = async (id: string) => {
  return prisma.usuario.delete({ where: { id } });
};