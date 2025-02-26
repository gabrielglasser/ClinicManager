import express from 'express';
import {
  criarSalaController,
  buscarSalaPorIdController,
  listarSalasController,
  atualizarSalaController,
  deletarSalaController,
} from '../controllers/salaController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para salas (protegidas por autenticação)
router.post('/salas', authMiddleware, criarSalaController);
router.get('/salas', authMiddleware, listarSalasController);
router.get('/salas/:id', authMiddleware, buscarSalaPorIdController);
router.put('/salas/:id', authMiddleware, atualizarSalaController);
router.delete('/salas/:id', authMiddleware, deletarSalaController);

export default router;