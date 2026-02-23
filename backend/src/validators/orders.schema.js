import { z } from "zod";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const createOrderSchema = z.object({
  restaurantId: z
    .string({ required_error: "restaurantId est requis" })
    .uuid("restaurantId doit être un UUID valide"),

  userId: z
    .string()
    .uuid("userId doit être un UUID valide")
    .optional(),

  phone: z
    .string()
    .min(8, "Numéro de téléphone invalide")
    .optional(),

  items: z
    .array(
      z.object({
        menuItemId: z
          .string({ required_error: "menuItemId est requis" })
          .uuid("menuItemId doit être un UUID valide"),

        quantity: z
          .number({ required_error: "quantity est requis" })
          .int("quantity doit être un entier")
          .min(1, "quantity doit être au moins 1"),
      }),
      { required_error: "items est requis" }
    )
    .min(1, "La commande doit contenir au moins un article"),

  notes: z.string().max(500, "Notes trop longues (max 500 caractères)").optional(),

  dropoffLocation: z
    .object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "coordinates doit contenir [longitude, latitude]"),
    })
    .optional(),

  dropoffAddressText: z.string().optional(),

  deliveryFee: z.number().min(0).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, {
    errorMap: () => ({
      message: `status doit être l'une des valeurs: ${ORDER_STATUSES.join(", ")}`,
    }),
  }),
});
