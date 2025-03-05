import { Request, Response } from "express";
import {
  criarMedico,
  buscarMedicoPorId,
  listarMedicos,
  atualizarMedico,
  deletarMedico,
} from "../services/medicoService";
import { ICreateMedico, IUpdateMedico } from "../interfaces/IMedico";
import {
  uploadMiddleware,
  handleUpload,
} from "../middlewares/uploadMiddleware";

export const criarMedicoController = [
  uploadMiddleware,
  handleUpload,
  async (req: Request, res: Response) => {
    const { nome, crm, especialidadeId, telefone, email } = req.body;
    const photo = req.body.photo;

    try {
      const dadosMedico = {
        nome,
        crm,
        especialidadeId,
        telefone,
        email,
        photo: photo || "",
      };

      const medico = await criarMedico(dadosMedico);
      res.status(201).json(medico);
    } catch (error) {
      console.error("Erro ao criar médico:", error);
      res.status(400).json({ error: "Erro ao criar médico" });
    }
  },
];

export const buscarMedicoPorIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const medico = await buscarMedicoPorId(id);
    if (!medico) {
      return res.status(404).json({ error: "Médico não encontrado." });
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

export const atualizarMedicoController = [
  uploadMiddleware,
  handleUpload,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, crm, especialidadeId, telefone, email } = req.body;
    const photo = req.body.photo;

    try {
      const dadosAtualizacao: any = {};

      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (crm !== undefined) dadosAtualizacao.crm = crm;
      if (especialidadeId !== undefined)
        dadosAtualizacao.especialidadeId = especialidadeId;
      if (telefone !== undefined) dadosAtualizacao.telefone = telefone;
      if (email !== undefined) dadosAtualizacao.email = email;
      if (photo !== undefined) dadosAtualizacao.photo = photo;

      const medico = await atualizarMedico(id, dadosAtualizacao);
      res.status(200).json(medico);
    } catch (error) {
      console.error("Erro ao atualizar médico:", error);
      res.status(400).json({ error: "Erro ao atualizar médico" });
    }
  },
];

export const deletarMedicoController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarMedico(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};
