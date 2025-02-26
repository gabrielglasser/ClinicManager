export interface ISala {
  id: string;
  numero: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSala {
  numero: number;
}

export interface IUpdateSala {
  numero?: number;
}