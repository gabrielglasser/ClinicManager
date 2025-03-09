import { PrismaClient, Consulta } from '@prisma/client';
import { ICreateConsulta, IUpdateConsulta } from '../interfaces/IConsulta';

const prisma = new PrismaClient();

// Criar um paciente
export const criarConsulta = async (data: ICreateConsulta): Promise<Consulta> => {
  return prisma.consulta.create({ data });
};

// Buscar um paciente por ID
export const buscarConsultaPorId = async (id: string): Promise<Consulta | null> => {
  return prisma.consulta.findUnique({ where: { id } });
};

// Listar todos os pacientes
export const listarConsultas = async (): Promise<Consulta[]> => {
  return prisma.consulta.findMany({
    include: {
      paciente: true,
      medico: true,
      sala: true
    }
  });
};

// Atualizar um paciente
export const atualizarConsulta = async (id: string, data: IUpdateConsulta): Promise<Consulta> => {
  return prisma.consulta.update({ where: { id }, data });
};

// Deletar um paciente
export const deletarConsulta = async (id: string): Promise<void> => {
  await prisma.consulta.delete({ where: { id } });
};