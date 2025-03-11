import { Request, Response } from 'express';
import {
  criarEspecialidade,
  buscarEspecialidadePorId,
  listarEspecialidades,
  atualizarEspecialidade,
  deletarEspecialidade,
} from '../services/especialidadeService';
import { ICreateEspecialidade, IUpdateEspecialidade } from '../interfaces/IEspecialidade';

// Criar uma especialidade
export const criarEspecialidadeController = async (req: Request, res: Response) => {
  const data: ICreateEspecialidade = req.body;
  try {
    const especialidade = await criarEspecialidade(data);
    res.status(201).json(especialidade);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Buscar uma especialidade por ID
export const buscarEspecialidadePorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const especialidade = await buscarEspecialidadePorId(id);
    if (!especialidade) {
      return res.status(404).json({ error: 'Especialidade não encontrada.' });
    }
    res.status(200).json(especialidade);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Listar todas as especialidades
export const listarEspecialidadesController = async (req: Request, res: Response) => {
  try {
    const especialidades = await listarEspecialidades();
    res.status(200).json(especialidades);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Atualizar uma especialidade
export const atualizarEspecialidadeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: IUpdateEspecialidade = req.body;
  try {
    const especialidade = await atualizarEspecialidade(id, data);
    res.status(200).json(especialidade);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Deletar uma especialidade
export const deletarEspecialidadeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarEspecialidade(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Erro ao excluir especialidade' });
    }
  }
};