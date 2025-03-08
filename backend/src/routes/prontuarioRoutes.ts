import { Router } from 'express';
import {
  criarProntuarioController,
  buscarProntuarioPorIdController,
  listarProntuariosController,
  atualizarProntuarioController,
  deletarProntuarioController
} from '../controllers/prontuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas de prontuário requerem autenticação
router.use(authMiddleware);

// Criar novo prontuário
router.post('/prontuarios', criarProntuarioController);

// Listar todos os prontuários
router.get('/prontuarios', listarProntuariosController);

// Buscar prontuário por ID
router.get('/prontuarios/:id', buscarProntuarioPorIdController);

// Atualizar prontuário
router.put('/prontuarios/:id', atualizarProntuarioController);

// Deletar prontuário
router.delete('/prontuarios/:id', deletarProntuarioController);

export default router;