import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "@/components/layout/AuthLayout";
import Seo from "@/components/layout/Seo";
import AuthInput from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store";
import type { RegisterRequest } from "@/types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Backend formati: +998901234567
const PHONE_REGEX = /^\+998\d{9}$/;
const MIN_PASSWORD = 8;

type FormState = RegisterRequest;
type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: "",
  firstname: "",
  username: "",
  email: "",
  phone: "+998",
  password: "",
};

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "To'liq ismni kiriting";
  if (!form.firstname.trim()) errors.firstname = "Ismni kiriting";

  if (!form.username.trim()) {
    errors.username = "Foydalanuvchi nomini kiriting";
  } else if (form.username.trim().length < 3) {
    errors.username = "Kamida 3 belgi bo'lishi kerak";
  }

  if (!form.email.trim()) {
    errors.email = "Email manzilini kiriting";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Email manzili noto'g'ri";
  }

  if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Format: +998901234567";
  }

  if (form.password.length < MIN_PASSWORD) {
    errors.password = `Parol kamida ${MIN_PASSWORD} belgidan iborat bo'lishi kerak`;
  }

  return errors;
};

export default function SignUp() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const update =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Yozishni boshlagach xato yozuvi darhol ketadi
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found = validate(form);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const payload: RegisterRequest = {
      name: form.name.trim(),
      firstname: form.firstname.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    };

    try {
      setIsLoading(true);
      const signedIn = await signUp(payload, true);

      if (signedIn) {
        toast.success("Xush kelibsiz!");
        navigate("/", { replace: true });
        return;
      }

      // Backend token bermadi — hisob yaratildi, endi kirish kerak
      toast.success("Hisob yaratildi, endi tizimga kiring");
      navigate("/signin", { replace: true });
    } catch (error) {
      // "Email already exists" kabi server xabarlari shu yerda ko'rinadi
      toast.error(
        error instanceof Error
          ? error.message
          : "Ro'yxatdan o'tishda xato yuz berdi",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Sign Up"
        description="Create a 3legant account."
        noIndex
      />

      <AuthLayout>
        <div className="flex flex-col gap-2">
          <h1 className="font-medium text-[32px] sm:text-[40px]">Sign Up</h1>
          <p className="text-[14px] text-[#6C7275]">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[#38CB89] font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <AuthInput
            label="Full name"
            placeholder="Your full name"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
          />

          <AuthInput
            label="First name"
            placeholder="Your first name"
            autoComplete="given-name"
            value={form.firstname}
            onChange={update("firstname")}
            error={errors.firstname}
          />

          <AuthInput
            label="Username"
            placeholder="Username"
            autoComplete="username"
            value={form.username}
            onChange={update("username")}
            error={errors.username}
          />

          <AuthInput
            label="Email address"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
          />

          <AuthInput
            label="Phone number"
            type="tel"
            placeholder="+998901234567"
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            error={errors.phone}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-12 mt-1"
          >
            Sign Up
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}
