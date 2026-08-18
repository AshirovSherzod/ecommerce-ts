import { z } from "zod";
import { requiredText } from "@/schemas/common";

export const reviewSchema = z.object({
  author: requiredText("Ismingizni kiriting"),
  // RatingInput 1..5 oralig'ida qiymat beradi
  rating: z.number().int().min(1, "Baho tanlang").max(5),
  text: requiredText("Sharh matnini yozing"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;

export const replySchema = z.object({
  author: requiredText("Ismingizni kiriting"),
  text: requiredText("Javob matnini yozing"),
});

export type ReplyValues = z.infer<typeof replySchema>;
