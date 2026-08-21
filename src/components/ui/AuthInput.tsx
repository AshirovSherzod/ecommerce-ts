import { useId, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";


// `ComponentPropsWithRef` — react-hook-form `register()` qaytargan `ref` ni
// ham qabul qilishi uchun (React 19'da ref oddiy prop)
interface AuthInputProps
  extends Omit<React.ComponentPropsWithRef<"input">, "className"> {
  /** Ko'rinmaydigan yorliq — placeholder yagona belgi bo'lib qolmasligi uchun */
  label: string;
  error?: string;
}

/**
 * Auth sahifalaridagi chiziqli (underline) maydon. `type="password"`
 * berilsa ko'rsatish/yashirish tugmasi o'zi qo'shiladi.
 */
export default function AuthInput({
  label,
  error,
  type = "text",
  ...rest
}: AuthInputProps) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const errorId = useId();

  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          {...rest}
          type={inputType}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full h-10 ${
            isPassword ? "pr-8" : ""
          } border-b outline-none text-[14px] text-[#141718] placeholder:text-[#6C7275] transition-colors ${
            error
              ? "border-[#FF5630]"
              : "border-[#E8ECEF] focus:border-[#141718]"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            aria-label={show ? t("a11y.hidePassword") : t("a11y.showPassword")}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xl text-[#6C7275] hover:text-[#141718] transition-colors"
          >
            {show ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        )}
      </div>

      {error && (
        <span id={errorId} className="text-[12px] text-[#FF5630]">
          {error}
        </span>
      )}
    </div>
  );
}
