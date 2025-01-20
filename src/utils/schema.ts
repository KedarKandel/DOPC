import { z } from "zod";

// Custom regular expression for a valid number with up to 2 decimal places
const twoDecimalRegex = /^\d+(\.\d{1,2})?$/;

// zod schema for form data
export const schema = z.object({
  venueSlug: z.string().min(3, { message: "Venue is required" }),
  cartValue: z
    .string()
    .regex(twoDecimalRegex, {
      message: "Cart value must be a positive number with up to 2 decimal places.",
    }),
  userLatitude: z.string().nonempty("Latitude is required."),
  userLongitude: z.string().nonempty("Longitude is required."),
});

export type FormData = z.infer<typeof schema>;