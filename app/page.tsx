import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AFTER_AUTH_URL, SIGN_IN_URL } from "@/lib/auth-routes";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect(AFTER_AUTH_URL);
  }

  redirect(SIGN_IN_URL);
}
