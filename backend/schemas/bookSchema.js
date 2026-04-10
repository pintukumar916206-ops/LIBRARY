import { z } from "zod";

export const addBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title is too long."),
  author: z
    .string()
    .trim()
    .min(1, "Author is required.")
    .max(200, "Author is too long."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(1000, "Description is too long."),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price cannot be negative."),
  ),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "Quantity cannot be negative."),
  ),
});

export const updateBookSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    author: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(1000).optional(),
    price: z.preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().min(0).optional(),
    ),
    quantity: z.preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().int().min(0).optional(),
    ),
  })
  .strict();
