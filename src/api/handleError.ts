import { AxiosError } from "axios";

// Servislar uchun umumiy xato ishlovchisi
export const handleError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data?.message ?? error.message);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error("Kutilmagan xato yuz berdi");
};
