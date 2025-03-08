import { Request, Response } from 'express';
import {
  criarMedico,
  buscarMedicoPorId,
  listarMedicos,
  atualizarMedico,
  deletarMedico,
} from '../services/medicoService';
import { ICreateMedico, IUpdateMedico } from '../interfaces/IMedico';
import { uploadMiddleware, handleUpload } from '../middlewares/uploadMiddleware';

export const criarMedicoController = [
  uploadMiddleware,
  handleUpload,
  async (req: Request, res: Response) => {
    try {
      const { nome, crm, especialidadeId, telefone, email } = req.body;
      const photo = req.body.photo || "";

      if (!nome || !crm || !especialidadeId || !telefone || !email) {
        return res.status(400).json({
          error: 'Dados inválidos',
          message: 'Todos os campos são obrigatórios'
        });
      }

      const dadosMedico: ICreateMedico = {
        nome,
        crm,
        especialidadeId,
        telefone,
        email,
        photo
      };

      const medico = await criarMedico(dadosMedico);
      res.status(201).json(medico);
    } catch (error) {
      console.error('Erro ao criar médico:', error);
      if (error instanceof Error) {
        res.status(400).json({
          error: 'Erro ao criar médico',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Erro interno do servidor',
          message: 'Ocorreu um erro ao criar o médico'
        });
      }
    }
  }
];

export const buscarMedicoPorIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medico = await buscarMedicoPorId(id);
    
    if (!medico) {
      return res.status(404).json({ error: 'Médico não encontrado.' });
    }
    
    res.status(200).json(medico);
  } catch (error) {
    console.error('Erro ao buscar médico:', error);
    res.status(500).json({ error: 'Erro ao buscar médico' });
  }
};

export const listarMedicosController = async (req: Request, res: Response) => {
  try {
    const medicos = await listarMedicos();
    res.status(200).json(medicos);
  } catch (error) {
    console.error('Erro ao listar médicos:', error);
    res.status(500).json({ error: 'Erro ao listar médicos' });
  }
};

export const atualizarMedicoController = [
  uploadMiddleware,
  handleUpload,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nome, crm, especialidadeId, telefone, email } = req.body;
      const photo = req.body.photo;

      const dadosAtualizacao: IUpdateMedico = {};
      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (crm !== undefined) dadosAtualizacao.crm = crm;
      if (especialidadeId !== undefined) dadosAtualizacao.especialidadeId = especialidadeId;
      if (telefone !== undefined) dadosAtualizacao.telefone = telefone;
      if (email !== undefined) dadosAtualizacao.email = email;
      if (photo !== undefined) dadosAtualizacao.photo = photo;

      const medico = await atualizarMedico(id, dadosAtualizacao);
      res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);
      res.status(400).json({ error: 'Erro ao atualizar médico' });
    }
  }
];

export const deletarMedicoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletarMedico(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar médico:', error);
    res.status(400).json({ error: 'Erro ao deletar médico' });
  }
};