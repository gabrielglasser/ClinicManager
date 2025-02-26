import { Request, Response } from 'express';
import {
  criarFuncionario,
  buscarFuncionarioPorId,
  listarFuncionarios,
  atualizarFuncionario,
  deletarFuncionario,
} from '../services/funcionarioService';
import { ICreateFuncionario, IUpdateFuncionario } from '../interfaces/IFuncionario';

// Criar um funcionário
export const criarFuncionarioController = async (req: Request, res: Response) => {
  const data: ICreateFuncionario = req.body;
  try {
    const funcionario = await criarFuncionario(data);
    res.status(201).json(funcionario);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Buscar um funcionário por ID
export const buscarFuncionarioPorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const funcionario = await buscarFuncionarioPorId(id);
    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado.' });
    }
    res.status(200).json(funcionario);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Listar todos os funcionários
export const listarFuncionariosController = async (req: Request, res: Response) => {
  try {
    const funcionarios = await listarFuncionarios();
    res.status(200).json(funcionarios);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Atualizar um funcionário
export const atualizarFuncionarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateFuncionario = req.body;
  try {
    const funcionario = await atualizarFuncionario(id, data);
    res.status(200).json(funcionario);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Deletar um funcionário
export const deletarFuncionarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarFuncionario(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};