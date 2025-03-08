import { PrismaClient, Prontuario } from '@prisma/client';
import { ICreateProntuario, IUpdateProntuario } from '../interfaces/IProntuario';

const prisma = new PrismaClient();

// Criar um prontuário
export const criarProntuario = async (data: ICreateProntuario): Promise<Prontuario> => {
  return prisma.prontuario.create({
    data,
    include: {
      paciente: true
    }
  });
};

// Buscar um prontuário por ID
export const buscarProntuarioPorId = async (id: string): Promise<Prontuario | null> => {
  return prisma.prontuario.findUnique({
    where: { id },
    include: {
      paciente: true
    }
  });
};

// Buscar todos os prontuários
export const listarProntuarios = async (): Promise<Prontuario[]> => {
  return prisma.prontuario.findMany({
    include: {
      paciente: true
    }
  });
};

// Atualizar um prontuário
export const atualizarProntuario = async (id: string, data: IUpdateProntuario): Promise<Prontuario> => {
  return prisma.prontuario.update({
    where: { id },
    data,
    include: {
      paciente: true
    }
  });
};

// Deletar um prontuário
export const deletarProntuario = async (id: string): Promise<void> => {
  await prisma.prontuario.delete({ where: { id } });
};