"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, Briefcase, Activity, Clock,
  BarChart3, Globe, Layers, MapPin,
  TrendingUp, UserCheck, FileText,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { timeAgo } from "@/lib/timeAgo";

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const { data } = await api.get("/admin/analytics");
      return data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const u = data?.users || {};
  const j = data?.jobs || {};
  const scrapers = data?.scrapers || {};
  const apps = data?.applications || {};

  return (
    <div className="space-y-6 py-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{u.total ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{u.active_today ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{u.new_today ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active 30d</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{u.active_30d ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{j.total ?? 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jobs Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{j.added_today ?? 0}</div></CardContent>
        </Card>
      </div>

      {/* User Analytics */}
      <Card>
        <CardHeader><CardTitle>User Analytics</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Active users (30d)</p>
                <p className="text-2xl font-bold">{u.active_30d ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Returning users</p>
                <p className="text-2xl font-bold">{Math.max(0, (u.active_today ?? 0))}</p>
              </div>
            </div>
            {u.daily_signups && u.daily_signups.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Daily Signups (30 days)</p>
                <div className="flex items-end gap-1 h-24">
                  {u.daily_signups.map((d: { date: string; count: number }, i: number) => {
                    const max = Math.max(...u.daily_signups.map((x: { count: number }) => x.count), 1);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">{d.count}</span>
                        <div
                          className="w-full bg-primary/60 rounded-t"
                          style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Analytics */}
      <Card>
        <CardHeader><CardTitle>Job Analytics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold">{j.active ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired Jobs</p>
              <p className="text-2xl font-bold">{j.expired ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Daily Additions</p>
              <p className="text-2xl font-bold">{j.avg_daily_additions ?? 0}</p>
            </div>
          </div>

          {j.daily_jobs && j.daily_jobs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Jobs Added Per Day (14 days)</p>
              <div className="flex items-end gap-1 h-32">
                {j.daily_jobs.map((d: { date: string; count: number }, i: number) => {
                  const max = Math.max(...j.daily_jobs.map((x: { count: number }) => x.count), 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">{d.count}</span>
                      <div
                        className="w-full bg-blue-500/60 rounded-t"
                        style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1"><Globe className="h-4 w-4" /> By Source</p>
              {j.by_source?.map((s: { name: string; count: number }) => (
                <div key={s.name} className="flex items-center justify-between py-1">
                  <span className="text-sm capitalize">{s.name.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold">{s.count}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1"><Layers className="h-4 w-4" /> By Category</p>
              {j.by_category?.map((c: { name: string; count: number }) => (
                <div key={c.name} className="flex items-center justify-between py-1">
                  <span className="text-sm capitalize">{c.name.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold">{c.count}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1"><MapPin className="h-4 w-4" /> By Location</p>
              {j.by_location?.map((l: { name: string; count: number }) => (
                <div key={l.name} className="flex items-center justify-between py-1">
                  <span className="text-sm">{l.name}</span>
                  <span className="text-sm font-bold">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scraper Analytics */}
      <Card>
        <CardHeader><CardTitle>Scraper Health</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scrapers?.adapters && Object.entries(scrapers.adapters).map(([name, info]: [string, any]) => (
              <div key={name} className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${info.healthy ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-sm font-medium capitalize">{name.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Fetched: {info.fetched ?? 0}</span>
                  <span>Inserted: {info.inserted ?? 0}</span>
                  <span>Errors: {info.errors ?? 0}</span>
                  <span>Last: {info.last_sync ? timeAgo(info.last_sync) : "Never"}</span>
                </div>
              </div>
            ))}
            {(!scrapers?.adapters || Object.keys(scrapers.adapters).length === 0) && (
              <p className="text-sm text-muted-foreground">No scraper data available yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Application Analytics */}
      <Card>
        <CardHeader><CardTitle>Application Analytics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Applications</p>
              <p className="text-2xl font-bold">{apps.total ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{apps.success_rate ?? 0}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{apps.failed ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Retries</p>
              <p className="text-2xl font-bold">{apps.retry_count ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${scrapers?.healthy_adapters === scrapers?.total_adapters ? "bg-green-500" : "bg-yellow-500"}`} />
              <div>
                <p className="text-sm">Scrapers</p>
                <p className="text-xs text-muted-foreground">{scrapers?.healthy_adapters ?? 0}/{scrapers?.total_adapters ?? 0} healthy</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Sync</p>
              <p className="text-sm font-medium">{scrapers?.last_sync ? timeAgo(scrapers.last_sync) : "Never"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
