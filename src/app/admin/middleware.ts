import { auth } from "@/lib/auth";
import { db } from "@/server/db/drizzle";
import { user } from "@/server/db/schema.db";
import { eq, sql } from "drizzle-orm";

export async function checkAndSetFirstAdmin(userId: string) {
  // Check if any admin exists
  const adminCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(eq(user.role, "admin"));

  const hasAdmin = adminCount[0]?.count && adminCount[0].count > 0;

  if (!hasAdmin) {
    // No admin exists, make this user the admin
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, userId));
    
    return true; // User was made admin
  }

  return false; // Admin already exists
}