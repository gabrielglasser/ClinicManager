import { IUsuario } from './IUsuario';

export interface IFuncionario {
  id: string;
  nome: string;
  telefone: string;
  especialidadeId: string;
  usuario?: IUsuario;
  usuarioId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFuncionario {
  nome: string;
  telefone: string;
  especialidadeId: string;
  usuarioId?: string;
}

export interface IUpdateFuncionario {
  nome?: string;
  telefone?: string;
  especialidadeId?: string;
  usuarioId?: string;
}