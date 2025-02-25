export interface IUsuario {
    id: string;
    nome: string;
    email: string;
    senha: string;
    photo: string;
    tipo: 'ADMIN' | 'FUNCIONARIO' | 'MEDICO';
    createdAt: Date;
    updatedAt: Date;
  }