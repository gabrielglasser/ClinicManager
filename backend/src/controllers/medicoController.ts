import { Request, Response } from 'express';
import {
  criarMedico,
  buscarMedicoPorId,
  listarMedicos,
  atualizarMedico,
  deletarMedico,
} from '../services/medicoService';
import { ICreateMedico, IUpdateMedico } from '../interfaces/IMedico';

export const criarMedicoController = async (req: Request, res: Response) => {
  const data: ICreateMedico = req.body;
  try {
    const medico = await criarMedico(data);
    res.status(201).json(medico);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const buscarMedicoPorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const medico = await buscarMedicoPorId(id);
    if (!medico) {
      return res.status(404).json({ error: 'Médico não encontrado.' });
    }
    res.status(200).json(medico);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const listarMedicosController = async (req: Request, res: Response) => {
  try {
    const medicos = await listarMedicos();
    res.status(200).json(medicos);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const atualizarMedicoController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateMedico = req.body;
  try {
    const medico = await atualizarMedico(id, data);
    res.status(200).json(medico);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deletarMedicoController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarMedico(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};