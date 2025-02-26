import express from 'express';
import {
  criarConsultaController,
  buscarConsultaPorIdController,
  listarConsultasController,
  atualizarConsultaController,
  deletarConsultaController,
} from '../controllers/consultaController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para consultas (protegidas por autenticação)
router.post('/consultas', authMiddleware, criarConsultaController);
router.get('/consultas', authMiddleware, listarConsultasController);
router.get('/consultas/:id', authMiddleware, buscarConsultaPorIdController);
router.put('/consultas/:id', authMiddleware, atualizarConsultaController);
router.delete('/consultas/:id', authMiddleware, deletarConsultaController);

export default router;