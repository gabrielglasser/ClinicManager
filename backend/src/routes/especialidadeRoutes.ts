import express from 'express';
import {
  criarEspecialidadeController,
  buscarEspecialidadePorIdController,
  listarEspecialidadesController,
  atualizarEspecialidadeController,
  deletarEspecialidadeController,
} from '../controllers/especialidadeController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas para especialidades (protegidas por autenticação)
router.post('/especialidades', authMiddleware, criarEspecialidadeController);
router.get('/especialidades', authMiddleware, listarEspecialidadesController);
router.get('/especialidades/:id', authMiddleware, buscarEspecialidadePorIdController);
router.put('/especialidades/:id', authMiddleware, atualizarEspecialidadeController);
router.delete('/especialidades/:id', authMiddleware, deletarEspecialidadeController);

export default router;