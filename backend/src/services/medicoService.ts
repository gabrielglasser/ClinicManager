import { PrismaClient, Medico } from '@prisma/client';
import { ICreateMedico, IUpdateMedico } from '../interfaces/IMedico';

const prisma = new PrismaClient();

// Criar um paciente
export const criarMedico = async (data: ICreateMedico): Promise<Medico> => {
  return prisma.medico.create({ data });
};

// Buscar um paciente por ID
export const buscarMedicoPorId = async (id: string): Promise<Medico | null> => {
  return prisma.medico.findUnique({ where: { id } });
};

// Listar todos os pacientes
export const listarMedicos = async (): Promise<Medico[]> => {
  return prisma.medico.findMany();
};

// Atualizar um paciente
export const atualizarMedico = async (id: string, data: IUpdateMedico): Promise<Medico> => {
  return prisma.medico.update({ where: { id }, data });
};

// Deletar um paciente
export const deletarMedico = async (id: string): Promise<void> => {
  await prisma.medico.delete({ where: { id } });
};