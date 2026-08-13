import { useEffect, useState } from "react";

interface CountdownProps {
  // ISO sana — chegirma tugash vaqti
  deadline: string;
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const pad = (value: number) => String(value).padStart(2, "0");

export default function Countdown({ deadline }: CountdownProps) {
  const target = new Date(deadline).getTime();

  // Qolgan vaqtni state'da emas, render paytida hisoblaymiz — shunda
  // `deadline` almashsa qiymat darhol yangilanadi
  const [now, setNow] = useState(() => Date.now());

  const remaining = Math.max(0, target - now);
  // Yaroqsiz sana yoki tugagan aksiya — taymer kerak emas
  const expired = Number.isNaN(target) || remaining === 0;

  useEffect(() => {
    if (expired) return;

    const timer = setInterval(() => setNow(Date.now()), SECOND);

    return () => clearInterval(timer);
  }, [expired]);

  if (expired) return null;

  const units = [
    { label: "Days", value: Math.floor(remaining / DAY) },
    { label: "Hours", value: Math.floor((remaining % DAY) / HOUR) },
    { label: "Minutes", value: Math.floor((remaining % HOUR) / MINUTE) },
    { label: "Seconds", value: Math.floor((remaining % MINUTE) / SECOND) },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-[#6C7275]">Offer expires in:</p>
      <ul className="flex gap-2">
        {units.map((unit) => (
          <li
            key={unit.label}
            className="w-15 sm:w-16 py-1.5 bg-[#F3F5F7] rounded-md flex flex-col items-center"
          >
            <span className="font-medium text-lg sm:text-xl tabular-nums">
              {pad(unit.value)}
            </span>
            <span className="text-[11px] text-[#6C7275]">{unit.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
