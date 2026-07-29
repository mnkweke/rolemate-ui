"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity, Filter, Clock, User,
  Shield, RefreshCw, AlertCircle, CheckCircle2,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";


import api from "@/lib/api";
import { timeAgo } from "@/lib/timeAgo";

const eventTypeColors: Record<string, string> = {
  login: "bg-blue-500",
  admin_user_created: "bg-green-500",
  admin_user_updated: "bg-yellow-500",
  admin_user_removed: "bg-red-500",
  sync_started: "bg-purple-500",
  sync_completed: "bg-indigo-500",
  sync_failed: "bg-red-500",
};

export default function AdminActivityPage() {
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState("");
  const [days, setDays] = useState("7");
  const [searchUser, setSearchUser] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "activity", page, eventType, days],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, page_size: 50, days: parseInt(days) };
      if (eventType) params.event_type = eventType;
      const { data } = await api.get("/admin/activity-log", { params });
      return data;
    },
    refetchInterval: 15000,
  });

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const eventTypes: string[] = data?.event_types ?? [];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h3 className="text-lg font-semibold">Activity Log</h3>
        <p className="text-sm text-muted-foreground">{total} events recorded</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={eventType}
          onChange={(e) => { setEventType(e.target.value); setPage(1); }}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-44"
        >
          <option value="">All events</option>
          {eventTypes.map((et) => (
            <option key={et} value={et}>{et.replace(/_/g, " ")}</option>
          ))}
        </select>
        <select
          value={days}
          onChange={(e) => { setDays(e.target.value); setPage(1); }}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-28"
        >
          <option value="1">24 hours</option>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>
      ) : (
        <div className="space-y-1">
          {entries.map((entry: any) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center gap-4 py-3">
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${eventTypeColors[entry.event_type] || "bg-gray-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{entry.user_name || "System"}</span>
                    <Badge variant="outline" className="text-xs">{entry.event_type.replace(/_/g, " ")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{entry.description}</p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{entry.created_at ? timeAgo(entry.created_at) : ""}</div>
              </CardContent>
            </Card>
          ))}
          {entries.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No activity recorded</p>}
        </div>
      )}

      {total > 50 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="flex items-center text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 50)}</span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
