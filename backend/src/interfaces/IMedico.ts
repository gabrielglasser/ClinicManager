export interface IMedico {
  id: string;
  nome: string;
  crm: string;
  especialidadeId: string;
  telefone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMedico {
  nome: string;
  crm: string;
  especialidadeId: string;
  telefone: string;
}

export interface IUpdateMedico {
  nome?: string;
  crm?: string;
  especialidadeId?: string;
  telefone?: string;
}