import { z } from "zod";
import { requiredText } from "@/schemas/common";

export const reviewSchema = z.object({
  author: requiredText("validation:nameRequired"),
  // RatingInput 1..5 oralig'ida qiymat beradi
  rating: z.number().int().min(1, "validation:ratingRequired").max(5),
  text: requiredText("validation:reviewTextRequired"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;

export const replySchema = z.object({
  author: requiredText("validation:nameRequired"),
  text: requiredText("validation:replyTextRequired"),
});

export type ReplyValues = z.infer<typeof replySchema>;
