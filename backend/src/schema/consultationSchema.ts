import { z } from "zod";

export const consultationSchema = z.object({

});

export type ConsultationSchema = z.infer<typeof consultationSchema>;