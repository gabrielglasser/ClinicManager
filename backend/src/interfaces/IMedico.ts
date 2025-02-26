import { IUsuario } from './IUsuario';

export interface IMedico {
  id: string;
  nome: string;
  crm: string;
  especialidadeId: string;
  telefone: string;
  usuario?: IUsuario;
  usuarioId?: string;
  createdAt: Date;
  updatedAt: Date;
}