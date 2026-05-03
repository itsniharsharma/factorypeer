import { z } from "zod";

export const deleteMediaBodySchema = z.object({
  publicId: z.string().min(1).max(500),
});
