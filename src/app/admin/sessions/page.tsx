import { db } from "@/server/db/drizzle";
import { session, user } from "@/server/db/schema.db";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Monitor, Smartphone, Globe } from "lucide-react";
import { requireAdmin } from "../auth-check";

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
    .limit(100);

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Globe className="h-4 w-4" />;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return "Unknown Device";
    
    // Simple parsing - in production, use a proper user agent parser
    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("edge")) return "Edge";
    return "Unknown Browser";
  };

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Active Sessions</h1>
        <p className="text-gray-600 mt-2">Monitor and manage user sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((sessionData) => (
                  <TableRow key={sessionData.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {sessionData.userName || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sessionData.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(sessionData.userAgent)}
                        <span>{getDeviceInfo(sessionData.userAgent)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sessionData.ipAddress || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(sessionData.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(sessionData.expiresAt), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      {isExpired(sessionData.expiresAt) ? (
                        <Badge variant="secondary">Expired</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No active sessions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}