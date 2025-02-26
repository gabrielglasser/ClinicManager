import express from 'express';
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import funcionarioRoutes from './routes/funcionarioRoutes';
import errorMiddleware from './middlewares/errorMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api', usuarioRoutes); // Rotas de usuário
app.use('/api', funcionarioRoutes); // Rotas de funcionário

// Middleware de erro
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});