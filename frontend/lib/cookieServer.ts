import { cookies } from "next/headers";

export async function getCookieServer() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("users/login")?.value;

  return token || null;
}