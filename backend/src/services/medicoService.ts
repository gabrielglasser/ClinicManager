import { PrismaClient, Medico } from "@prisma/client";
import { ICreateMedico, IUpdateMedico } from "../interfaces/IMedico";

const prisma = new PrismaClient();

// Criar um médico
export const criarMedico = async (data: ICreateMedico): Promise<Medico> => {
  return prisma.medico.create({
    data,
    include: {
      especialidade: true,
    },
  });
};

// Buscar um médico por ID
export const buscarMedicoPorId = async (id: string): Promise<Medico | null> => {
  return prisma.medico.findUnique({
    where: { id },
    include: {
      especialidade: true,
    },
  });
};

// Listar todos os médicos
export const listarMedicos = async (): Promise<Medico[]> => {
  return prisma.medico.findMany({
    include: {
      especialidade: true,
    },
  });
};

// Atualizar um médico
export const atualizarMedico = async (
  id: string,
  data: IUpdateMedico
): Promise<Medico> => {
  return prisma.medico.update({
    where: { id },
    data,
    include: {
      especialidade: true,
    },
  });
};

// Deletar um médico
export const deletarMedico = async (id: string): Promise<void> => {
  await prisma.medico.delete({ where: { id } });
};
