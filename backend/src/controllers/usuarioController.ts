import { Request, Response } from 'express';
import {
  criarUsuario,
  buscarUsuarioPorId,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
} from '../services/usuarioService';

// Criar um usuário
export const criarUsuarioController = async (req: Request, res: Response) => {
  const { nome, email, senha, photo, tipo } = req.body;
  try {
    const usuario = await criarUsuario({ nome, email, senha, photo, tipo });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Buscar um usuário por ID
export const buscarUsuarioPorIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usuario = await buscarUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Listar todos os usuários
export const listarUsuariosController = async (req: Request, res: Response) => {
  try {
    const usuarios = await listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Atualizar um usuário
export const atualizarUsuarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const usuario = await atualizarUsuario(id, data);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Deletar um usuário
export const deletarUsuarioController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deletarUsuario(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};