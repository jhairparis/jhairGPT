import { z } from "zod";

export const ModelSchema = z.object({
  company: z.string(),
  tier: z.number(),
  available: z.array(z.string()),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ModelsSchema = z.array(ModelSchema);

export type ModelDocument = z.infer<typeof ModelSchema>;
