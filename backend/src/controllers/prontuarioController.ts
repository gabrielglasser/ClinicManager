import { Request, Response } from 'express';
import {
  criarProntuario,
  buscarProntuarioPorId,
  listarProntuarios,
  atualizarProntuario,
  deletarProntuario,
} from '../services/prontuarioService';
import { ICreateProntuario, IUpdateProntuario } from '../interfaces/IProntuario';
import { Prisma } from '@prisma/client';

export const criarProntuarioController = async (req: Request, res: Response) => {
  const data: ICreateProntuario = req.body;
  try {
    const prontuario = await criarProntuario(data);
    res.status(201).json(prontuario);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          error: 'Este paciente já possui um prontuário cadastrado.',
          code: 'P2002'
        });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({
          error: 'Paciente não encontrado.',
          code: 'P2003'
        });
      }
    }
    console.error('Erro ao criar prontuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar prontuário.' });
  }
};

export const buscarProntuarioPorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const prontuario = await buscarProntuarioPorId(id);
    if (!prontuario) {
      return res.status(404).json({ error: 'Prontuário não encontrado.' });
    }
    res.status(200).json(prontuario);
  } catch (error) {
    console.error('Erro ao buscar prontuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar prontuário.' });
  }
};

export const listarProntuariosController = async (req: Request, res: Response) => {
  try {
    const prontuarios = await listarProntuarios();
    res.status(200).json(prontuarios);
  } catch (error) {
    console.error('Erro ao listar prontuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao listar prontuários.' });
  }
};

export const atualizarProntuarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateProntuario = req.body;
  try {
    const prontuario = await atualizarProntuario(id, data);
    res.status(200).json(prontuario);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Prontuário não encontrado.' });
      }
    }
    console.error('Erro ao atualizar prontuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar prontuário.' });
  }
};

export const deletarProntuarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarProntuario(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Prontuário não encontrado.' });
      }
    }
    console.error('Erro ao deletar prontuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar prontuário.' });
  }
};