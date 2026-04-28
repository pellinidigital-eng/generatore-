import type { z } from "zod";
import type { generateSocialInputSchema, socialContentSchema } from "@/lib/validation";

export type Platform = "Instagram" | "TikTok" | "Facebook" | "YouTube";
export type Tone = "diretto" | "educativo" | "persuasivo" | "amichevole" | "professionale";
export type Goal = "vendere" | "ottenere contatti" | "aumentare engagement" | "educare" | "creare fiducia";

export type GenerateSocialInput = z.infer<typeof generateSocialInputSchema>;
export type SocialContent = z.infer<typeof socialContentSchema>;
