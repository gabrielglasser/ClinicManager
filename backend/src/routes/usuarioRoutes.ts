import express from 'express';
import {
  criarUsuarioController,
  buscarUsuarioPorIdController,
  listarUsuariosController,
  atualizarUsuarioController,
  deletarUsuarioController,
} from '../controllers/usuarioController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para usuários
router.post('/usuarios', criarUsuarioController);
router.get('/usuarios', authMiddleware, listarUsuariosController);
router.get('/usuarios/:id', authMiddleware, buscarUsuarioPorIdController);
router.put('/usuarios/:id', authMiddleware, atualizarUsuarioController);
router.delete('/usuarios/:id', authMiddleware, deletarUsuarioController);

export default router;