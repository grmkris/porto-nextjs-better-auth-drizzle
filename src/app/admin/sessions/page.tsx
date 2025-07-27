import { db } from "@/server/db/drizzle";
import { session, user } from "@/server/db/schema.db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../auth-check";
import SessionsClient from "./client";

export default async function SessionsPage() {
  await requireAdmin();

  // Get all active sessions with user info
  const sessions = await db
    .select({
      id: session.id,
      token: session.token,
      userId: session.userId,
      userName: user.name,
      userEmail: user.email,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
    })
    .from(session)
    .leftJoin(user, eq(session.userId, user.id))
    .orderBy(desc(session.createdAt))
    .limit(500); // Get more sessions for client-side pagination

  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(session);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Active Sessions</h1>
        <p className="text-gray-600 mt-2">Monitor and manage user sessions</p>
      </div>

      <SessionsClient initialSessions={sessions} totalCount={count} />
    </div>
  );
}
