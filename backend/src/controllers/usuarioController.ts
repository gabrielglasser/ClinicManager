import { Request, Response } from 'express';
import {
  criarUsuario,
  buscarUsuarioPorId,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
} from '../services/usuarioService';
import { uploadMiddleware, handleUpload } from '../middlewares/uploadMiddleware';

// Criar um usuário
export const criarUsuarioController = [
  uploadMiddleware, 
  handleUpload, 
  async (req: Request, res: Response) => {
    const { nome, email, senha, tipo } = req.body;
    const photo = req.body.photo; 
    try {
      const usuario = await criarUsuario({ nome, email, senha, photo, tipo });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json(error);
    }
  },
];

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
export const atualizarUsuarioController = [
  uploadMiddleware, 
  handleUpload, 
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, email, senha, tipo } = req.body;
    const photo = req.body.photo; 

    try {
      const usuario = await atualizarUsuario(id, { nome, email, senha, photo, tipo });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(400).json(error);
    }
  },
];

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