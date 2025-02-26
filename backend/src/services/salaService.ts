import { PrismaClient, Sala } from '@prisma/client';
import { ICreateSala, IUpdateSala } from '../interfaces/ISala';

const prisma = new PrismaClient();

// Criar um paciente
export const criarSala = async (data: ICreateSala): Promise<Sala> => {
  return prisma.sala.create({ data });
};

// Buscar um paciente por ID
export const buscarSalaPorId = async (id: string): Promise<Sala | null> => {
  return prisma.sala.findUnique({ where: { id } });
};

// Buscar todos os pacientes
export const listarSalas = async (): Promise<Sala[]> => {
  return prisma.sala.findMany();
};

// Atualizar um paciente
export const atualizarSala = async (id: string, data: IUpdateSala): Promise<Sala> => {
  return prisma.sala.update({ where: { id }, data });
};

// Deletar um paciente
export const deletarSala = async (id: string): Promise<void> => {
  await prisma.sala.delete({ where: { id } });
};