import { z } from "zod";

export const recordBorrowSchema = z.object({
  borrowDate: z.string().optional(),
});
