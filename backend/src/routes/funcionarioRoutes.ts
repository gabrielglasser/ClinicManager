import express from 'express';
import {
  criarFuncionarioController,
  buscarFuncionarioPorIdController,
  listarFuncionariosController,
  atualizarFuncionarioController,
  deletarFuncionarioController,
} from '../controllers/funcionarioController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para funcionários (protegidas por autenticação)
router.post('/funcionarios', authMiddleware, criarFuncionarioController);
router.get('/funcionarios', authMiddleware, listarFuncionariosController);
router.get('/funcionarios/:id', authMiddleware, buscarFuncionarioPorIdController);
router.put('/funcionarios/:id', authMiddleware, atualizarFuncionarioController);
router.delete('/funcionarios/:id', authMiddleware, deletarFuncionarioController);

export default router;