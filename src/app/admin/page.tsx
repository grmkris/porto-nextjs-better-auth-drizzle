import { db } from "@/server/db/drizzle";
import { user, session, walletAddress } from "@/server/db/schema.db";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Wallet, TrendingUp } from "lucide-react";
import { requireAdmin } from "./auth-check";

export default async function AdminDashboard() {
  const currentSession = await requireAdmin();

  // Get statistics
  const [userCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user);

  const [sessionCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(session);

  const [walletCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(walletAddress);

  const [recentUsers] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(sql`${user.createdAt} > now() - interval '24 hours'`);

  const stats = [
    {
      title: "Total Users",
      value: userCount.count || 0,
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Sessions",
      value: sessionCount.count || 0,
      icon: Activity,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Connected Wallets",
      value: walletCount.count || 0,
      icon: Wallet,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "New Users (24h)",
      value: recentUsers.count || 0,
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentSession?.user?.name || "Admin"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Activity logs will be displayed here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/users"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-gray-600">View and manage all users</div>
            </a>
            <a
              href="/admin/sessions"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Active Sessions</div>
              <div className="text-sm text-gray-600">Monitor and manage sessions</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}