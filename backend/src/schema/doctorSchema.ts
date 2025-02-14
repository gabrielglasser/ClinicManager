import { z } from "zod";

export const doctorSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  crm: z.string().min(4, "CRM deve ter pelo menos 4 caracteres"),
  especialidadeId: z.string().min(3, "Especialidade deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(9, "Telefone deve ter pelo menos 9 caracteres"),
});

export type DoctorSchema = z.infer<typeof doctorSchema>;
