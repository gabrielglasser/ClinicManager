import { Request, Response } from 'express';
import {
  criarConsulta,
  buscarConsultaPorId,
  listarConsultas,
  atualizarConsulta,
  deletarConsulta,
} from '../services/consultaService';
import { ICreateConsulta, IUpdateConsulta } from '../interfaces/IConsulta';

export const criarConsultaController = async (req: Request, res: Response) => {
  const data: ICreateConsulta = req.body;
  try {
    const consulta = await criarConsulta(data);
    res.status(201).json(consulta);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const buscarConsultaPorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const consulta = await buscarConsultaPorId(id);
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta não encontrada.' });
    }
    res.status(200).json(consulta);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const listarConsultasController = async (req: Request, res: Response) => {
  try {
    const consultas = await listarConsultas();
    res.status(200).json(consultas);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const atualizarConsultaController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateConsulta = req.body;
  try {
    const consulta = await atualizarConsulta(id, data);
    res.status(200).json(consulta);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deletarConsultaController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarConsulta(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};