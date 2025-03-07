export interface IMedico {
  id: string;
  nome: string;
  crm: string;
  especialidadeId: string;
  telefone: string;
  email: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMedico {
  nome: string;
  crm: string;
  especialidadeId: string;
  telefone: string;
  email: string;
  photo?: string;
}

export interface IUpdateMedico {
  nome?: string;
  crm?: string;
  especialidadeId?: string;
  telefone?: string;
  email?: string;
  photo?: string;
}