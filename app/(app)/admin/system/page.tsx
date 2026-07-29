"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Settings, Server, Activity, Database,
  HardDrive, MemoryStick, Clock, Tag,
  Wifi, Cpu,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function AdminSystemPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "system"],
    queryFn: async () => {
      const { data } = await api.get("/admin/system");
      return data;
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const color = status === "healthy" || status === "running"
      ? "bg-green-500/10 text-green-500 border-green-500/30"
      : status === "stopped" || status === "unhealthy"
      ? "bg-red-500/10 text-red-500 border-red-500/30"
      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
    return <Badge variant="outline" className={color}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 py-6">
      <div>
        <h3 className="text-lg font-semibold">System Monitoring</h3>
        <p className="text-sm text-muted-foreground">Application health and resource usage</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduler</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={data?.scheduler?.status ?? "unknown"} />
            </div>
            <p className="text-xs text-muted-foreground">Last heartbeat: {data?.scheduler?.last_heartbeat ?? "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Queue</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <StatusBadge status={data?.queue?.status ?? "unknown"} />
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div><span className="text-muted-foreground">Queued:</span> {data?.queue?.queued ?? 0}</div>
              <div><span className="text-muted-foreground">Processing:</span> {data?.queue?.processing ?? 0}</div>
              <div><span className="text-muted-foreground">Failed:</span> {data?.queue?.failed ?? 0}</div>
              <div><span className="text-muted-foreground">Dead letter:</span> {data?.queue?.dead_letter ?? 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <StatusBadge status={data?.database?.status ?? "unknown"} />
            {data?.database?.error && (
              <p className="text-xs text-red-400 mt-1">{data.database.error}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Qdrant</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <StatusBadge status={data?.qdrant?.status ?? "unknown"} />
            <p className="text-xs text-muted-foreground mt-1">{data?.qdrant?.job_count ?? 0} jobs indexed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{formatBytes(data?.storage?.used ?? 0)} / {formatBytes(data?.storage?.total ?? 0)}</p>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(data?.storage?.percent_used ?? 0, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{formatBytes(data?.memory?.used ?? 0)} / {formatBytes(data?.memory?.total ?? 0)}</p>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full ${(data?.memory?.percent_used ?? 0) > 80 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${Math.min(data?.memory?.percent_used ?? 0, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{data?.uptime || "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Version</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono">{data?.version || "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{data?.environment || "N/A"}</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
