import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "@/components/layout/AuthLayout";
import Seo from "@/components/layout/Seo";
import AuthInput from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store";
import type { LoginRequest } from "@/types/auth.types";

// Backend `email` va `username` ni ham qabul qiladi, shuning uchun bitta
// maydon yetadi — kiritilganida "@" bo'lsa email deb yuboramiz
const buildCredentials = (identifier: string, password: string) =>
  ({
    ...(identifier.includes("@")
      ? { email: identifier }
      : { username: identifier }),
    password,
  }) satisfies LoginRequest;

interface LocationState {
  from?: string;
}

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Himoyalangan sahifadan kelgan bo'lsa, kirgandan so'ng o'sha yerga
  // qaytaramiz. Aks holda bosh sahifaga.
  const redirectTo = (location.state as LocationState | null)?.from ?? "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = identifier.trim();

    if (!trimmed) {
      toast.error("Email yoki foydalanuvchi nomini kiriting");
      return;
    }

    if (password.length < 8) {
      toast.error("Parol kamida 8 belgidan iborat bo'lishi kerak");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(buildCredentials(trimmed, password), remember);

      toast.success("Xush kelibsiz!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      // Server xabari `handleError` orqali keladi ("Invalid credentials")
      toast.error(
        error instanceof Error ? error.message : "Kirishda xato yuz berdi",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Sign In"
        description="Sign in to your 3legant account."
        noIndex
      />

      <AuthLayout>
        <div className="flex flex-col gap-2">
          <h1 className="font-medium text-[32px] sm:text-[40px]">Sign In</h1>
          <p className="text-[14px] text-[#6C7275]">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/signup"
              className="text-[#38CB89] font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AuthInput
            label="Username or email address"
            placeholder="Your username or email address"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-[14px] text-[#6C7275] cursor-pointer">
              <input
                className="w-5 h-5 accent-[#141718]"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => toast.info("Parolni tiklash tez orada qo'shiladi")}
              className="text-[14px] font-medium hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full h-12">
            Sign In
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}
