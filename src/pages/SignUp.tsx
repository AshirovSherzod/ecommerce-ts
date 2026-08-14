import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "@/components/layout/AuthLayout";
import Seo from "@/components/layout/Seo";
import AuthInput from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { signUpSchema, type SignUpValues } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store";

export default function SignUp() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      firstname: "",
      username: "",
      email: "",
      phone: "+998",
      password: "",
    },
  });

  // Sxema `.trim()` qilgani uchun qiymatlar tozalangan holda keladi
  const onSubmit = async (values: SignUpValues) => {
    try {
      const signedIn = await signUp(values, true);

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
    }
  };

  return (
    <>
      <Seo title="Sign Up" description="Create a 3legant account." noIndex />

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <AuthInput
            label="Full name"
            placeholder="Your full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          <AuthInput
            label="First name"
            placeholder="Your first name"
            autoComplete="given-name"
            error={errors.firstname?.message}
            {...register("firstname")}
          />

          <AuthInput
            label="Username"
            placeholder="Username"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />

          <AuthInput
            label="Email address"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthInput
            label="Phone number"
            type="tel"
            placeholder="+998901234567"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full h-12 mt-1"
          >
            Sign Up
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}
