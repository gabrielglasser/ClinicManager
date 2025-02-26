import { IPaciente } from './IPaciente';

export interface IProntuario {
  id: string;
  pacienteId: string;
  historico: string;
  paciente?: IPaciente;
  createdAt: Date;
  updatedAt: Date;
}