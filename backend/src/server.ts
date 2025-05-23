import express from "express";
import cors from "cors";
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
import { VercelRequest, VercelResponse } from "@vercel/node";
import logger from "./utils/logger";

dotenv.config();

const app = express();

// Configuração do CORS antes de qualquer rota
app.use(
  cors({
    origin: "https://clinic-manager-psi.vercel.app", // URL do frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

app.use(express.json());

// Middleware para logar requisições
app.use((req, res, next) => {
  // Adicionar headers CORS manualmente para garantir
  res.header("Access-Control-Allow-Origin", "https://clinic-manager-psi.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
  );
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

// Tratamento especial para OPTIONS
app.options("*", cors());

const PORT = process.env.PORT;

// Exporta como handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
