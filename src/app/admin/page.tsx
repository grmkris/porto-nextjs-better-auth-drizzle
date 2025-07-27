import { db } from "@/server/db/drizzle";
import { user, session, walletAddress } from "@/server/db/schema.db";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, TrendingUp, BarChart } from "lucide-react";
import { requireAdmin } from "./auth-check";

function calculatePercentageChange(
  growth: number,
  previousBase: number,
): { value: string; type: "positive" | "negative" | "neutral" } {
  // If there was no previous data and we have growth, it's new
  if (previousBase === 0 && growth > 0) {
    return { value: "New!", type: "positive" };
  }

  // If there was no previous data and no growth
  if (previousBase === 0 && growth === 0) {
    return { value: "N/A", type: "neutral" };
  }

  // If we have negative growth with no previous base
  if (previousBase === 0 && growth < 0) {
    return { value: "Error", type: "negative" };
  }

  // Normal percentage calculation
  const changePercent = (growth / previousBase) * 100;

  // Clamp extreme values
  if (changePercent > 999) {
    return { value: "+999%+", type: "positive" };
  }
  if (changePercent < -99) {
    return { value: "-99%+", type: "negative" };
  }

  const rounded = Math.round(changePercent * 10) / 10; // Round to 1 decimal place

  if (growth > 0) {
    return { value: `+${rounded}%`, type: "positive" };
  } else if (growth < 0) {
    return { value: `${rounded}%`, type: "negative" };
  }
  return { value: "0%", type: "neutral" };
}

export default async function AdminDashboard() {
  const currentSession = await requireAdmin();

  // Execute all queries in parallel for better performance
  const [
    [userCount],
    [sessionCount],
    [walletCount],
    [recentUsers],
    [userCount30DaysAgo],
    [sessionCount30DaysAgo],
    [walletCount30DaysAgo],
    [recentUsers24HoursAgo],
  ] = await Promise.all([
    // Current statistics
    db.select({ count: sql<number>`count(*)` }).from(user),
    db.select({ count: sql<number>`count(*)` }).from(session),
    db.select({ count: sql<number>`count(*)` }).from(walletAddress),
    db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.createdAt} > now() - interval '24 hours'`),

    // Get count from 30 days ago (for month-over-month comparison)
    db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.createdAt} <= now() - interval '30 days'`),
    db
      .select({ count: sql<number>`count(*)` })
      .from(session)
      .where(sql`${session.createdAt} <= now() - interval '30 days'`),
    db
      .select({ count: sql<number>`count(*)` })
      .from(walletAddress)
      .where(sql`${walletAddress.createdAt} <= now() - interval '30 days'`),

    // New users from previous 24-hour period (24-48 hours ago)
    db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(
        sql`${user.createdAt} > now() - interval '48 hours' AND ${user.createdAt} <= now() - interval '24 hours'`,
      ),
  ]);

  // Calculate percentage changes
  // For total counts, we compare growth in the last 30 days
  const userGrowth = (userCount.count || 0) - (userCount30DaysAgo.count || 0);
  const userChange = calculatePercentageChange(
    userGrowth,
    userCount30DaysAgo.count || 0,
  );

  const sessionGrowth =
    (sessionCount.count || 0) - (sessionCount30DaysAgo.count || 0);
  const sessionChange = calculatePercentageChange(
    sessionGrowth,
    sessionCount30DaysAgo.count || 0,
  );

  const walletGrowth =
    (walletCount.count || 0) - (walletCount30DaysAgo.count || 0);
  const walletChange = calculatePercentageChange(
    walletGrowth,
    walletCount30DaysAgo.count || 0,
  );

  // For 24h comparison, we directly compare the two periods
  const recentUsersChange = calculatePercentageChange(
    recentUsers.count || 0,
    recentUsers24HoursAgo.count || 0,
  );

  const stats = [
    {
      title: "Total Users",
      value: userCount.count || 0,
      icon: Users,
      change: userChange.value,
      changeType: userChange.type,
    },
    {
      title: "Active Sessions",
      value: sessionCount.count || 0,
      icon: BarChart,
      change: sessionChange.value,
      changeType: sessionChange.type,
    },
    {
      title: "Connected Wallets",
      value: walletCount.count || 0,
      icon: Wallet,
      change: walletChange.value,
      changeType: walletChange.type,
    },
    {
      title: "New Users (24h)",
      value: recentUsers.count || 0,
      icon: TrendingUp,
      change: recentUsersChange.value,
      changeType: recentUsersChange.type,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {currentSession?.user?.name || "Admin"}
        </p>
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
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {stat.change} from{" "}
                {stat.title === "New Users (24h)" ? "yesterday" : "last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="text-sm text-gray-600">
                View and manage all users
              </div>
            </a>
            <a
              href="/admin/sessions"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Active Sessions</div>
              <div className="text-sm text-gray-600">
                Monitor and manage sessions
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
