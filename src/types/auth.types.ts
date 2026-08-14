export interface User {
  id: string;
  email: string;
  username: string;
  firstname?: string;
  name?: string;
  phone?: string;
  createdAt?: string;
}

// Backend `email` va `username` ni ham qabul qiladi — foydalanuvchi
// bitta maydonga ikkalasidan birini kiritishi mumkin
export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

// Barcha maydonlar majburiy. email, phone va username unikal bo'lishi
// kerak, phone formati: +998901234567, parol kamida 8 belgi.
export interface RegisterRequest {
  email: string;
  phone: string;
  username: string;
  firstname: string;
  name: string;
  password: string;
}

/**
 * Register javobining aniq shakli hali tasdiqlanmagan (sinov akkaunti
 * yo'q). Ba'zi backendlar darhol token beradi, ba'zilari faqat
 * foydalanuvchini qaytaradi va alohida kirishni talab qiladi — shuning
 * uchun token ixtiyoriy va chaqiruvchi joy ikkala holatni ham hisobga oladi.
 */
export interface RegisterPayload {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface RegisterResponse {
  data: RegisterPayload;
  message: string;
  success: boolean;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken?: string;
  user?: User;
}

// Boshqa endpointlar kabi javob {data, message, success} ichida keladi
export interface LoginResponse {
  data: AuthPayload;
  message: string;
  success: boolean;
}

export interface UserResponse {
  data: User;
  message: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  signIn: (credentials: LoginRequest, remember: boolean) => Promise<void>;
  // `true` — ro'yxatdan o'tish bilan birga sessiya ham ochildi
  signUp: (data: RegisterRequest, remember: boolean) => Promise<boolean>;
  signOut: () => void;
  setUser: (user: User | null) => void;
}
