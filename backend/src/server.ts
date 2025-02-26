import express from "express";
import authRoutes from "./routes/authRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import funcionarioRoutes from "./routes/funcionarioRoutes";
import especialidadeRoutes from "./routes/especialidadeRoutes";
import medicoRoutes from "./routes/medicoRoutes";
import pacienteRoutes from "./routes/pacienteRoutes";
import consultaRoutes from "./routes/consultaRoutes";
import salaRoutes from "./routes/salaRoutes";
import prontuarioRoutes from "./routes/prontuarioRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import dotenv from "dotenv";
import logger from './utils/logger';

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes); // Rotas de autenticação
app.use("/api", usuarioRoutes); // Rotas de usuário
app.use("/api", funcionarioRoutes); // Rotas de funcionário
app.use("/api", especialidadeRoutes); // Rotas de especialidade
app.use("/api", medicoRoutes); // Rotas de médico
app.use("/api", pacienteRoutes); // Rotas de paciente
app.use("/api", consultaRoutes); // Rotas de consulta
app.use("/api", salaRoutes); // Rotas de sala
app.use("/api", prontuarioRoutes); // Rotas de prontuario

// Middleware de erro
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
