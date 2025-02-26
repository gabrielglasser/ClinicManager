export interface IProntuario {
  id: string;
  pacienteId: string;
  historico: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProntuario {
  pacienteId: string;
  historico: string;
}

export interface IUpdateProntuario {
  pacienteId?: string;
  historico?: string;
}