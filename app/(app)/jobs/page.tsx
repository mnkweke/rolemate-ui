"use client";

import { useState } from "react";
import {
  Search,
  Trash2,
  Loader2,
  MapPin,
  Globe,
  Briefcase,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobList } from "@/components/jobs/JobList";
import { useJobs } from "@/hooks/useJobs";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const sources = ["", "remotive", "arbeitnow"];
const seniorities = ["", "junior", "mid", "senior", "lead"];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [seniority, setSeniority] = useState("");
  const [source, setSource] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);

  const { jobs, isLoading, clearJobs } = useJobs({
    location: location || undefined,
    remote: remoteOnly || undefined,
    seniority: seniority || undefined,
    source: source || undefined,
    limit: 50,
  });

  const filteredJobs = search
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase()) ||
          j.description?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const handleClear = async () => {
    try {
      await clearJobs.mutateAsync();
      toast({
        title: "Jobs cleared",
        description: "All indexed jobs have been removed",
        variant: "success",
      });
      setShowClearDialog(false);
    } catch {
      toast({
        title: "Failed to clear",
        description: "Could not clear jobs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
          <p className="text-muted-foreground">
            Browse and search all indexed jobs
          </p>
        </div>
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear all jobs?</DialogTitle>
              <DialogDescription>
                This will permanently remove all indexed jobs from the
                database. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={clearJobs.isPending}
              >
                {clearJobs.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                Clear all
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                <Search className="h-3 w-3 inline mr-1" />
                Search
              </label>
              <Input
                placeholder="Title, company, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-[160px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                <MapPin className="h-3 w-3 inline mr-1" />
                Location
              </label>
              <Input
                placeholder="Any location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                <Briefcase className="h-3 w-3 inline mr-1" />
                Seniority
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
              >
                {seniorities.map((s) => (
                  <option key={s} value={s}>
                    {s || "All"}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[130px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Source
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s || "All"}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant={remoteOnly ? "default" : "outline"}
              size="sm"
              className="mb-0.5"
              onClick={() => setRemoteOnly(!remoteOnly)}
            >
              <Globe className="h-4 w-4 mr-1" />
              Remote
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
        </p>
        <Badge variant="secondary">
          {jobs.length} indexed
        </Badge>
      </div>

      <JobList
        jobs={filteredJobs}
        isLoading={isLoading}
        emptyMessage={
          search || location || seniority || source || remoteOnly
            ? "No jobs match your filters"
            : "No jobs indexed yet. Try scraping some!"
        }
      />
    </div>
  );
}
