import express from 'express';
import {
  criarPacienteController,
  buscarPacientePorIdController,
  listarPacientesController,
  atualizarPacienteController,
  deletarPacienteController,
} from '../controllers/pacienteController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para pacientes (protegidas por autenticação)
router.post('/pacientes', authMiddleware, criarPacienteController);
router.get('/pacientes', authMiddleware, listarPacientesController);
router.get('/pacientes/:id', authMiddleware, buscarPacientePorIdController);
router.put('/pacientes/:id', authMiddleware, atualizarPacienteController);
router.delete('/pacientes/:id', authMiddleware, deletarPacienteController);

export default router;