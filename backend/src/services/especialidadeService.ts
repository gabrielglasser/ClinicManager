import { PrismaClient, Especialidade } from '@prisma/client';
import { ICreateEspecialidade, IUpdateEspecialidade } from '../interfaces/IEspecialidade';

const prisma = new PrismaClient();

// Criar uma especialidade
export const criarEspecialidade = async (data: ICreateEspecialidade): Promise<Especialidade> => {
  return prisma.especialidade.create({ data });
};

// Buscar uma especialidade por ID
export const buscarEspecialidadePorId = async (id: string): Promise<Especialidade | null> => {
  return prisma.especialidade.findUnique({ where: { id } });
};

// Listar todas as especialidades
export const listarEspecialidades = async (): Promise<Especialidade[]> => {
  return prisma.especialidade.findMany();
};

// Atualizar uma especialidade
export const atualizarEspecialidade = async (id: string, data: IUpdateEspecialidade): Promise<Especialidade> => {
  return prisma.especialidade.update({ where: { id }, data });
};

// Deletar uma especialidade
export const deletarEspecialidade = async (id: string): Promise<void> => {
  await prisma.especialidade.delete({ where: { id } });
};