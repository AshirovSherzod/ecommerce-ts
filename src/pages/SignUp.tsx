import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/components/layout/AuthLayout";
import Seo from "@/components/layout/Seo";
import AuthInput from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { signUpSchema, type SignUpValues } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store";

export default function SignUp() {
  const { t } = useTranslation("auth");
  const { t: tv } = useTranslation();
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
        toast.success(t("signIn.welcome"));
        navigate("/", { replace: true });
        return;
      }

      // Backend token bermadi — hisob yaratildi, endi kirish kerak
      toast.success(t("signUp.created"));
      navigate("/signin", { replace: true });
    } catch (error) {
      // "Email already exists" kabi server xabarlari shu yerda ko'rinadi
      toast.error(error instanceof Error ? error.message : t("signUp.failed"));
    }
  };

  return (
    <>
      <Seo title={t("signUp.title")} noIndex />

      <AuthLayout>
        <div className="flex flex-col gap-2">
          <h1 className="font-medium text-[32px] sm:text-[40px]">
            {t("signUp.title")}
          </h1>
          <p className="text-[14px] text-[#6C7275]">
            {t("signUp.hasAccount")}{" "}
            <Link
              to="/signin"
              className="text-[#38CB89] font-medium hover:underline"
            >
              {t("signUp.signInLink")}
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <AuthInput
            label={t("signUp.name")}
            placeholder={t("signUp.namePlaceholder")}
            autoComplete="name"
            error={errors.name?.message && tv(errors.name.message)}
            {...register("name")}
          />

          <AuthInput
            label={t("signUp.firstname")}
            placeholder={t("signUp.firstnamePlaceholder")}
            autoComplete="given-name"
            error={errors.firstname?.message && tv(errors.firstname.message)}
            {...register("firstname")}
          />

          <AuthInput
            label={t("signUp.username")}
            placeholder={t("signUp.usernamePlaceholder")}
            autoComplete="username"
            error={errors.username?.message && tv(errors.username.message)}
            {...register("username")}
          />

          <AuthInput
            label={t("signUp.email")}
            type="email"
            placeholder={t("signUp.emailPlaceholder")}
            autoComplete="email"
            error={errors.email?.message && tv(errors.email.message)}
            {...register("email")}
          />

          <AuthInput
            label={t("signUp.phone")}
            type="tel"
            placeholder="+998901234567"
            autoComplete="tel"
            error={errors.phone?.message && tv(errors.phone.message)}
            {...register("phone")}
          />

          <AuthInput
            label={t("signUp.password")}
            type="password"
            placeholder={t("signUp.passwordPlaceholder")}
            autoComplete="new-password"
            error={errors.password?.message && tv(errors.password.message)}
            {...register("password")}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full h-12 mt-1"
          >
            {t("signUp.submit")}
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}
