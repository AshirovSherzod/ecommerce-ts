import { loadEnv } from "vite";

// Vite'ning o'z yuklovchisi — dotenv kabi qo'shimcha paket kerak emas
const env = loadEnv("development", process.cwd(), "");

/** API manzili, oxiridagi "/" siz */
export const API_URL = (env.VITE_API_URL ?? "").replace(/\/+$/, "");
