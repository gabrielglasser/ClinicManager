import { z } from "zod";

export const patientSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    idade: z.number().min(3, "Idade deve ter pelo menos 1 caracteres"),
    telefone: z.string().min(9, "Telefone deve ter pelo menos 9 caracteres"),
    endereco: z.string().min(3, "Endereço deve ter pelo menos 3 caracteres"),
});

export type PatientRequest = z.infer<typeof patientSchema>;