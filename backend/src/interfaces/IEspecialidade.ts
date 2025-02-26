export interface IEspecialidade {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateEspecialidade {
  nome: string;
}

export interface IUpdateEspecialidade {
  nome?: string;
}