import { PrismaClient, Paciente } from '@prisma/client';
import { ICreatePaciente, IUpdatePaciente } from '../interfaces/IPaciente';

const prisma = new PrismaClient();

// Criar um paciente
export const criarPaciente = async (data: ICreatePaciente): Promise<Paciente> => {
  return prisma.paciente.create({ data });
};

// Buscar um paciente por ID
export const buscarPacientePorId = async (id: string): Promise<Paciente | null> => {
  return prisma.paciente.findUnique({ where: { id } });
};

// Listar todos os pacientes
export const listarPacientes = async (): Promise<Paciente[]> => {
  return prisma.paciente.findMany();
};


// Atualizar um paciente
export const atualizarPaciente = async (id: string, data: IUpdatePaciente): Promise<Paciente> => {
  return prisma.paciente.update({ where: { id }, data });
};


// Deletar um paciente
export const deletarPaciente = async (id: string): Promise<void> => {
  await prisma.paciente.delete({ where: { id } });
};