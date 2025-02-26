import { PrismaClient, Funcionario } from '@prisma/client';
import { ICreateFuncionario, IUpdateFuncionario } from '../interfaces/IFuncionario';

const prisma = new PrismaClient();

// Criar um funcionário
export const criarFuncionario = async (data: ICreateFuncionario): Promise<Funcionario> => {
  return prisma.funcionario.create({ data });
};

// Buscar um funcionário por ID
export const buscarFuncionarioPorId = async (id: string): Promise<Funcionario | null> => {
  return prisma.funcionario.findUnique({ where: { id } });
};

// Listar todos os funcionários
export const listarFuncionarios = async (): Promise<Funcionario[]> => {
  return prisma.funcionario.findMany();
};

// Atualizar um funcionário
export const atualizarFuncionario = async (id: string, data: IUpdateFuncionario): Promise<Funcionario> => {
  return prisma.funcionario.update({ where: { id }, data });
};

// Deletar um funcionário
export const deletarFuncionario = async (id: string): Promise<void> => {
  await prisma.funcionario.delete({ where: { id } });
};