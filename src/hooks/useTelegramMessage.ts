import axios from "axios";
import { useState } from "react";

export const useTelegramMessage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);

	const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
	const CHAT_ID = import.meta.env.VITE_CHAT_ID;

	const sendMessage = async (text: string) => {
		try {
			setIsLoading(true);
			await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
				chat_id: CHAT_ID,
				text,
			});
		} catch (err) {
			if (err) {
				setSuccess(false);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return {
		sendMessage,
		isLoading,
		success,
	};
};
