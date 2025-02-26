export interface IConsulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  data: Date;
  salaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateConsulta {
  pacienteId: string;
  medicoId: string;
  data: Date;
  salaId: string;
}

export interface IUpdateConsulta {
  pacienteId?: string;
  medicoId?: string;
  data?: Date;
  salaId?: string;
}