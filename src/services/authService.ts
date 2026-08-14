import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import { handleError } from "@/api/handleError";
import type {
  AuthPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  UserResponse,
} from "@/types/auth.types";

// ─── Kirish ────────────────────────────────────
// POST /auth/login
export const login = async (credentials: LoginRequest) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Ro'yxatdan o'tish ────────────────────────────────────
// POST /auth/register
export const register = async (data: RegisterRequest) => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      ENDPOINTS.AUTH.REGISTER,
      data,
    );

    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Joriy foydalanuvchi ────────────────────────────────────
// GET /users/me — token bilan ishlaydi
export const getMe = async () => {
  try {
    const response = await axiosInstance.get<UserResponse>(
      ENDPOINTS.USERS.ME,
    );

    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};

// ─── Chiqish ────────────────────────────────────
// POST /auth/logout — server sessiyani yopadi. Xato bo'lsa ham lokal
// tokenni tozalaymiz, shuning uchun bu yerda xato yutiladi.
export const logout = async () => {
  try {
    await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
  } catch {
    // Serverga yetib bormasa ham foydalanuvchi chiqishi kerak
  }
};

export type { AuthPayload, User };
