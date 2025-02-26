import { Request, Response } from 'express';
import {
  criarPaciente,
  buscarPacientePorId,
  listarPacientes,
  atualizarPaciente,
  deletarPaciente,
} from '../services/pacienteService';
import { ICreatePaciente, IUpdatePaciente } from '../interfaces/IPaciente';

export const criarPacienteController = async (req: Request, res: Response) => {
  const data: ICreatePaciente = req.body;
  try {
    const paciente = await criarPaciente(data);
    res.status(201).json(paciente);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const buscarPacientePorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const paciente = await buscarPacientePorId(id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado.' });
    }
    res.status(200).json(paciente);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const listarPacientesController = async (req: Request, res: Response) => {
  try {
    const pacientes = await listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const atualizarPacienteController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdatePaciente = req.body;
  try {
    const paciente = await atualizarPaciente(id, data);
    res.status(200).json(paciente);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deletarPacienteController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarPaciente(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};