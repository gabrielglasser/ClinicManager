import { Request, Response } from 'express';
import {
  criarSala,
  buscarSalaPorId,
  listarSalas,
  atualizarSala,
  deletarSala,
} from '../services/salaService';
import { ICreateSala, IUpdateSala } from '../interfaces/ISala';

export const criarSalaController = async (req: Request, res: Response) => {
  const data: ICreateSala = req.body;
  try {
    const sala = await criarSala(data);
    res.status(201).json(sala);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const buscarSalaPorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sala = await buscarSalaPorId(id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala não encontrada.' });
    }
    res.status(200).json(sala);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const listarSalasController = async (req: Request, res: Response) => {
  try {
    const salas = await listarSalas();
    res.status(200).json(salas);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const atualizarSalaController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateSala = req.body;
  try {
    const sala = await atualizarSala(id, data);
    res.status(200).json(sala);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deletarSalaController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarSala(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};