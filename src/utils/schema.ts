import { z } from "zod";

const cartSchema = z.coerce
  .number() // Coerce input to a number
  .positive({
    message:
      "Cart value must be a positive number with up to 2 decimal places.",
  }) // Ensure positive number
  .refine(
    (value) => value === Math.round(value * 100) / 100, // Check if the number has up to two decimal places
    {
      message: "Cart value must be a number with up to 2 decimal places.",
    }
  );

// Latitude validation
const latitudeSchema = z
  .union([
    z.string().nonempty({ message: "Latitude is required" }).transform(Number),
    z.number(),
  ])
  .refine((lat) => !isNaN(lat) && lat >= -90 && lat <= 90, {
    message: "Latitude must be a number between -90 and 90.",
  });

// Longitude validation
const longitudeSchema = z
  .union([
    z.string().nonempty({ message: "Longitude is required" }).transform(Number),
    z.number(),
  ])
  .refine((lon) => !isNaN(lon) && lon >= -180 && lon <= 180, {
    message: "Longitude must be a number between -180 and 180.",
  });

// zod schema for form data
export const schema = z.object({
  venueSlug: z.string().min(3, { message: "Venue with 3 or more characters." }),
  cartValue: cartSchema,
  userLatitude: latitudeSchema,
  userLongitude: longitudeSchema,
});

export type FormData = z.infer<typeof schema>;
