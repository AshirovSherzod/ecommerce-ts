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
  signOut: () => void;
  setUser: (user: User | null) => void;
}
