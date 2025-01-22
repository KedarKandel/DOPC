import { z } from "zod";

// Custom regular expression for a valid number with up to 2 decimal places
const twoDecimalRegex = /^\d+(\.\d{1,2})?$/;

// cartValue validation


// Latitude validation
const latitudeSchema = z.number().refine((lat) => lat >= -90 && lat <= 90, {
  message: "Latitude must be a number between -90 and 90.",
});
// longitude validation
const longitudeSchema = z.number().refine((lon) => lon >= -180 && lon <= 180, {
  message: "Longitude must be a number between -180 and 180.",
});

// zod schema for form data
export const schema = z.object({
  venueSlug: z.string().min(3, { message: "Venue with 3 or more characters." }),
  cartValue: z.string().regex(twoDecimalRegex, {
    message:
      "Cart value must be a positive number with up to 2 decimal places.",
  }),
  userLatitude: latitudeSchema,
  userLongitude: longitudeSchema,
});

export type FormData = z.infer<typeof schema>;
