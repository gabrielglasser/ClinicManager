import express from 'express';
import {
  criarMedicoController,
  buscarMedicoPorIdController,
  listarMedicosController,
  atualizarMedicoController,
  deletarMedicoController,
} from '../controllers/medicoController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para médicos (protegidas por autenticação)
router.post('/medicos', authMiddleware, criarMedicoController);
router.get('/medicos', authMiddleware, listarMedicosController);
router.get('/medicos/:id', authMiddleware, buscarMedicoPorIdController);
router.put('/medicos/:id', authMiddleware, atualizarMedicoController);
router.delete('/medicos/:id', authMiddleware, deletarMedicoController);

export default router;