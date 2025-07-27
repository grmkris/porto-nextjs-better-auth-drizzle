import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkAndSetFirstAdmin } from "./middleware";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Check if user should be made admin (first user to access admin)
  const wasSetAsAdmin = await checkAndSetFirstAdmin(session.user.id);
  
  // Refresh session if user was just made admin
  if (wasSetAsAdmin) {
    redirect("/admin");
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}