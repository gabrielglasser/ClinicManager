import express from 'express';
import {
  criarProntuarioController,
  buscarProntuarioPorIdController,
  listarProntuariosController,
  atualizarProntuarioController,
  deletarProntuarioController,
} from '../controllers/prontuarioController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para prontuários (protegidas por autenticação)
router.post('/prontuarios', authMiddleware, criarProntuarioController);
router.get('/prontuarios', authMiddleware, listarProntuariosController);
router.get('/prontuarios/:id', authMiddleware, buscarProntuarioPorIdController);
router.put('/prontuarios/:id', authMiddleware, atualizarProntuarioController);
router.delete('/prontuarios/:id', authMiddleware, deletarProntuarioController);

export default router;