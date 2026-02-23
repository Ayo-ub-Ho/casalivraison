import { z } from "zod";

export const requestOtpSchema = z.object({
  phone: z
    .string({ required_error: "Le téléphone est requis" })
    .min(8, "Le numéro doit contenir au moins 8 caractères")
    .max(15, "Le numéro ne peut pas dépasser 15 caractères"),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string({ required_error: "Le téléphone est requis" })
    .min(8, "Numéro de téléphone invalide"),

  code: z
    .string({ required_error: "Le code OTP est requis" })
    .regex(/^\d{4}$/, "Le code doit contenir exactement 4 chiffres"),
});
