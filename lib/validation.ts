import { z } from "zod";

export const platforms = ["Instagram", "TikTok", "Facebook", "YouTube"] as const;
export const tones = ["diretto", "educativo", "persuasivo", "amichevole", "professionale"] as const;
export const goals = ["vendere", "ottenere contatti", "aumentare engagement", "educare", "creare fiducia"] as const;

export const hookAngles = [
  "curiosità",
  "errore comune",
  "problema urgente",
  "desiderio",
  "prima/dopo",
  "mito da sfatare",
  "domanda diretta",
  "paura/frustrazione",
  "opportunità",
  "CTA morbida"
] as const;

export const captionTypes = ["educativa", "di vendita", "storytelling", "engagement", "autorevole"] as const;

export const carouselRoles = [
  "titolo forte",
  "problema",
  "errore comune",
  "cambio prospettiva",
  "soluzione",
  "esempio pratico",
  "CTA"
] as const;

export const generateSocialInputSchema = z.object({
  description: z
    .string()
    .trim()
    .min(12, "Inserisci una descrizione piu dettagliata.")
    .max(1600, "La descrizione e troppo lunga."),
  platform: z.enum(platforms),
  tone: z.enum(tones),
  goal: z.enum(goals)
});

export const socialContentAISchema = z.object({
  hooks: z
    .array(
      z.object({
        angle: z.enum(hookAngles),
        text: z.string().trim().min(8).max(220)
      })
    )
    .length(10),
  captions: z
    .array(
      z.object({
        type: z.enum(captionTypes),
        title: z.string().trim().min(4).max(120),
        text: z.string().trim().min(80).max(1300)
      })
    )
    .length(5),
  carousel: z
    .array(
      z.object({
        slide: z.number().int().min(1).max(7),
        role: z.enum(carouselRoles),
        text: z.string().trim().min(8).max(260)
      })
    )
    .length(7),
  ctas: z.array(z.string().trim().min(8).max(220)).length(5)
});

export const socialContentSchema = socialContentAISchema.refine(
  (content) => content.carousel.every((item, index) => item.slide === index + 1),
  {
    message: "Le slide del carosello devono essere ordinate da 1 a 7.",
    path: ["carousel"]
  }
);
