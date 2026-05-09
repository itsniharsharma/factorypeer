import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  NEXT_PUBLIC_CATALOG_ACTOR_ID: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

let memo: PublicEnv | undefined;

export function getPublicEnv(): PublicEnv {
  if (!memo) {
    memo = publicEnvSchema.parse({
      NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL: process.env.NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL,
      NEXT_PUBLIC_CATALOG_ACTOR_ID: process.env.NEXT_PUBLIC_CATALOG_ACTOR_ID,
    });
  }

  return memo;
}

export function getCatalogActorId(): string | undefined {
  const actorId = getPublicEnv().NEXT_PUBLIC_CATALOG_ACTOR_ID;
  return actorId && /^[a-f\d]{24}$/i.test(actorId) ? actorId : undefined;
}
