import { IPaciente } from './IPaciente';
import { IMedico } from './IMedico';

export interface IConsulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  data: Date;
  salaId: string;
  paciente?: IPaciente;
  medico?: IMedico;
  createdAt: Date;
  updatedAt: Date;
}