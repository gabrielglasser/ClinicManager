import { Request, Response } from 'express';
import {
  criarProntuario,
  buscarProntuarioPorId,
  listarProntuarios,
  atualizarProntuario,
  deletarProntuario,
} from '../services/prontuarioService';
import { ICreateProntuario, IUpdateProntuario } from '../interfaces/IProntuario';

export const criarProntuarioController = async (req: Request, res: Response) => {
  const data: ICreateProntuario = req.body;
  try {
    const prontuario = await criarProntuario(data);
    res.status(201).json(prontuario);
  } catch (error) {
    res.status(400).json(error);
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
    res.status(400).json(error);
  }
};

export const listarProntuariosController = async (req: Request, res: Response) => {
  try {
    const prontuarios = await listarProntuarios();
    res.status(200).json(prontuarios);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const atualizarProntuarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateProntuario = req.body;
  try {
    const prontuario = await atualizarProntuario(id, data);
    res.status(200).json(prontuario);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deletarProntuarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarProntuario(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};