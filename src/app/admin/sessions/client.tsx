"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Monitor, Smartphone, Globe, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Session {
  id: string;
  token: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

interface SessionsClientProps {
  initialSessions: Session[];
  totalCount: number;
}

export default function SessionsClient({
  initialSessions,
  totalCount,
}: SessionsClientProps) {
  const [sessions] = useState(initialSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Globe className="h-4 w-4" />;

    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
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

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      session.userEmail?.toLowerCase().includes(search) ||
      session.userName?.toLowerCase().includes(search) ||
      session.ipAddress?.toLowerCase().includes(search)
    );
  });

  // Paginate filtered sessions
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredSessions.length / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Sessions</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by email, name, or IP..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        {paginatedSessions.length > 0 ? (
          <>
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
                {paginatedSessions.map((sessionData) => (
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
                    <TableCell>{sessionData.ipAddress || "Unknown"}</TableCell>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredSessions.length)} of{" "}
                  {filteredSessions.length} sessions
                  {searchQuery && ` (filtered from ${sessions.length} total)`}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "No sessions found matching your search"
              : "No active sessions found"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
