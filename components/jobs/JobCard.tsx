"use client";

import { useState } from "react";
import {
  MapPin,
  Building2,
  Globe,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const score = job.match_score;
  const scoreColor =
    score != null
      ? score >= 80
        ? "text-green-400"
        : score >= 50
        ? "text-yellow-400"
        : "text-red-400"
      : "text-muted-foreground";

  const scoreBg =
    score != null
      ? score >= 80
        ? "bg-green-500/10 border-green-500/30"
        : score >= 50
        ? "bg-yellow-500/10 border-yellow-500/30"
        : "bg-red-500/10 border-red-500/30"
      : "bg-muted";

  const badgeVariant = score != null
    ? score >= 80 ? "success" : score >= 50 ? "warning" : "danger"
    : "secondary";

  const postedDate = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString()
    : "Unknown";

  return (
    <Card className={`transition-all ${expanded ? "ring-1 ring-primary/20" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base mb-1 truncate">
              {job.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              {job.remote && (
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Remote
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {postedDate}
              </span>
            </div>
          </div>
          {score != null && (
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ${scoreBg}`}
            >
              <span className={`text-sm font-bold ${scoreColor}`}>
                {Math.round(score)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {job.source}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.seniority}
          </Badge>
          {job.skills?.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {(job.skills?.length ?? 0) > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4}
            </Badge>
          )}
        </div>

        {expanded && (
          <div className="space-y-3 mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-6">
              {job.description || "No description available."}
            </p>

            {job.why_matched && (
              <div>
                <h4 className="text-sm font-medium mb-1">Why matched</h4>
                <p className="text-sm text-muted-foreground">
                  {job.why_matched}
                </p>
              </div>
            )}

            {job.skill_gaps && job.skill_gaps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Skill gaps</h4>
                <div className="flex flex-wrap gap-1">
                  {job.skill_gaps.map((gap) => (
                    <Badge key={gap} variant="danger" className="text-xs">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(job.url, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View job
              </Button>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Show more
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
