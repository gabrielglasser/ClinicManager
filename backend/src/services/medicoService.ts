import { PrismaClient } from '@prisma/client';
import { ICreateMedico, IUpdateMedico } from '../interfaces/IMedico';

const prisma = new PrismaClient();

// Criar um paciente
export const criarMedico = async (data: ICreateMedico) => {
  try {
    // Verificar se o CRM já existe
    const medicoExistente = await prisma.medico.findFirst({
      where: { crm: data.crm }
    });

    if (medicoExistente) {
      throw new Error('Já existe um médico cadastrado com este CRM');
    }

    // Verificar se a especialidade existe
    const especialidade = await prisma.especialidade.findUnique({
      where: { id: data.especialidadeId }
    });

    if (!especialidade) {
      throw new Error('Especialidade não encontrada');
    }

    const medico = await prisma.medico.create({
      data: {
        nome: data.nome,
        crm: data.crm,
        especialidadeId: data.especialidadeId,
        telefone: data.telefone,
        email: data.email,
        photo: data.photo || ""
      },
      include: {
        especialidade: true
      }
    });

    return medico;
  } catch (error) {
    console.error('Erro no serviço ao criar médico:', error);
    throw error;
  }
};

// Buscar um paciente por ID
export const buscarMedicoPorId = async (id: string) => {
  return prisma.medico.findUnique({
    where: { id },
    include: {
      especialidade: true
    }
  });
};

// Listar todos os pacientes
export const listarMedicos = async () => {
  return prisma.medico.findMany({
    include: {
      especialidade: true
    }
  });
};

// Atualizar um paciente
export const atualizarMedico = async (id: string, data: IUpdateMedico) => {
  return prisma.medico.update({
    where: { id },
    data,
    include: {
      especialidade: true
    }
  });
};

// Deletar um paciente
export const deletarMedico = async (id: string) => {
  return prisma.medico.delete({
    where: { id }
  });
};