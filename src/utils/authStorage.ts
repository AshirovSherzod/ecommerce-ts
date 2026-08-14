const TOKEN_KEY = "accessToken";

/**
 * Token ikki joyda saqlanishi mumkin:
 *   localStorage   — "Remember me" belgilangan, brauzer yopilsa ham qoladi
 *   sessionStorage — belgilanmagan, tab yopilishi bilan o'chadi
 *
 * O'qiyotganda ikkalasini ham tekshiramiz, yozayotganda esa avval
 * ikkalasini tozalab, keyin kerakligiga yozamiz — aks holda eski token
 * boshqa joyda qolib ketib, chiqishdan keyin ham ishlatilib qolardi.
 */
export const getToken = (): string | null => {
  try {
    return (
      localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
    );
  } catch {
    // Maxfiylik rejimida storage bloklangan bo'lishi mumkin
    return null;
  }
};

export const setToken = (token: string, remember: boolean) => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
  } catch {
    // Saqlab bo'lmasa ham sessiya joriy sahifada ishlayveradi
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // e'tiborsiz
  }
};
