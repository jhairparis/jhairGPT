import { z } from "zod";

export const RespondSchema = z.object({
  result: z.any(),
  message: z.string(),
});
