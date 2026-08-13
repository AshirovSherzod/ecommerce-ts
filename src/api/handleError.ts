import { AxiosError } from "axios";

// Backend xatoni shu shaklda qaytaradi:
// { "error": { "code": "NOT_FOUND", "message": "Product not found" }, "success": false }
interface ApiErrorPayload {
  error?: { code?: string; message?: string };
  // Ba'zi endpointlar xabarni yuqori darajada qaytarishi mumkin
  message?: string;
}

// Status va kodni saqlab qolamiz — chaqiruvchi joyda 404 ni 500 dan
// ajratish yoki `code` bo'yicha shoxlanish kerak bo'lishi mumkin
export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const NETWORK_ERROR = "Serverga ulanib bo'lmadi — internetni tekshiring";
const UNKNOWN_ERROR = "Kutilmagan xato yuz berdi";

// Servislar uchun umumiy xato ishlovchisi
export const handleError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    // Javob umuman kelmagan bo'lsa — tarmoq yoki timeout muammosi.
    // Axios'ning "Network Error" matni foydalanuvchiga hech narsa demaydi.
    if (!error.response) {
      throw new ApiError(NETWORK_ERROR, undefined, error.code);
    }

    const message =
      payload?.error?.message ?? payload?.message ?? error.message;

    throw new ApiError(
      message,
      error.response.status,
      payload?.error?.code ?? error.code,
    );
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(UNKNOWN_ERROR);
};
