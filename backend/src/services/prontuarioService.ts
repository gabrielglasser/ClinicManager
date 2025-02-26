import { PrismaClient, Prontuario } from '@prisma/client';
import { ICreateProntuario, IUpdateProntuario } from '../interfaces/IProntuario';

const prisma = new PrismaClient();

// Criar um paciente
export const criarProntuario = async (data: ICreateProntuario): Promise<Prontuario> => {
  return prisma.prontuario.create({ data });
};

// Buscar um paciente por ID
export const buscarProntuarioPorId = async (id: string): Promise<Prontuario | null> => {
  return prisma.prontuario.findUnique({ where: { id } });
};

// Buscar todos os pacientes
export const listarProntuarios = async (): Promise<Prontuario[]> => {
  return prisma.prontuario.findMany();
};

// Atualizar um paciente
export const atualizarProntuario = async (id: string, data: IUpdateProntuario): Promise<Prontuario> => {
  return prisma.prontuario.update({ where: { id }, data });
};

// Deletar um paciente
export const deletarProntuario = async (id: string): Promise<void> => {
  await prisma.prontuario.delete({ where: { id } });
};