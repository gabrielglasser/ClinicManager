import { Request, Response } from "express";
import {
  criarPaciente,
  buscarPacientePorId,
  listarPacientes,
  atualizarPaciente,
  deletarPaciente,
} from "../services/pacienteService";
import {
  uploadMiddleware,
  handleUpload,
} from "../middlewares/uploadMiddleware";

export const criarPacienteController = [
  uploadMiddleware,
  handleUpload,
  async (req: Request, res: Response) => {
    const { nome, cpf, dataNascimento, telefone, endereco } = req.body;
    const photo = req.body.photo;

    try {
      if (!dataNascimento) {
        throw new Error("Data de nascimento é obrigatória");
      }

      // Converter a data para o formato correto
      const data = new Date(dataNascimento);
      if (isNaN(data.getTime())) {
        throw new Error("Data de nascimento inválida");
      }

      // Ajustar para o fuso horário local
      const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);

      const dadosPaciente = {
        nome,
        cpf,
        dataNascimento: dataAjustada,
        telefone,
        endereco,
        photo: photo || "",
      };

      const paciente = await criarPaciente(dadosPaciente);

      res.status(201).json(paciente);
    } catch (error) {
      console.error("Erro detalhado ao criar paciente:", error); // Debug
      if (error instanceof Error) {
        res.status(400).json({
          error: "Erro ao criar paciente",
          message: error.message,
          details: error.stack,
        });
      } else {
        res.status(500).json({
          error: "Erro interno do servidor",
          details: "Erro desconhecido ao criar paciente",
        });
      }
    }
  },
];

export const buscarPacientePorIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const paciente = await buscarPacientePorId(id);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(200).json(paciente);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const listarPacientesController = async (
  req: Request,
  res: Response
) => {
  try {
    const pacientes = await listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const atualizarPacienteController = [
  uploadMiddleware,
  handleUpload,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, cpf, dataNascimento, telefone, endereco } = req.body;
    const photo = req.body.photo;

    try {
      // Criar objeto com os campos que serão atualizados
      const dadosAtualizacao: any = {};

      // Adicionar apenas os campos que foram enviados na requisição
      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (cpf !== undefined) dadosAtualizacao.cpf = cpf;
      if (telefone !== undefined) dadosAtualizacao.telefone = telefone;
      if (endereco !== undefined) dadosAtualizacao.endereco = endereco;
      if (photo !== undefined) dadosAtualizacao.photo = photo;

      // Tratar a data de nascimento
      if (dataNascimento) {
        let dataNascimentoDate;

        if (typeof dataNascimento === "string") {
          // Se a data vier no formato yyyy-mm-dd
          if (dataNascimento.includes("-")) {
            const [ano, mes, dia] = dataNascimento.split("-");
            dataNascimentoDate = new Date(
              parseInt(ano),
              parseInt(mes) - 1,
              parseInt(dia)
            );
          }
          // Se a data vier no formato dd/mm/yyyy
          else if (dataNascimento.includes("/")) {
            const [dia, mes, ano] = dataNascimento.split("/");
            dataNascimentoDate = new Date(
              parseInt(ano),
              parseInt(mes) - 1,
              parseInt(dia)
            );
          }

          if (dataNascimentoDate && !isNaN(dataNascimentoDate.getTime())) {
            dadosAtualizacao.dataNascimento = dataNascimentoDate;
          } else {
            console.error("Data inválida após conversão");
          }
        }
      }

      const paciente = await atualizarPaciente(id, dadosAtualizacao);
      res.status(200).json(paciente);
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      res.status(400).json({ error: "Erro ao atualizar paciente" });
    }
  },
];

export const deletarPacienteController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    await deletarPaciente(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};
