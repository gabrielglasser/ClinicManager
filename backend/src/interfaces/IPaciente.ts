export interface IPaciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
  telefone: string;
  endereco: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePaciente {
  nome: string;
  cpf: string;
  dataNascimento: Date;
  telefone: string;
  endereco: string;
  photo: string;
}

export interface IUpdatePaciente {
  nome?: string;
  cpf?: string;
  dataNascimento?: Date;
  telefone?: string;
  endereco?: string;
  photo?: string;
}