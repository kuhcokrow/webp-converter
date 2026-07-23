"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { FileJob } from "@/lib/converter/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function statusBadge(job: FileJob) {
  switch (job.status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "converting":
      return <Badge>Converting…</Badge>;
    case "done":
      return <Badge variant="secondary">Done</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
  }
}

interface FileListProps {
  jobs: FileJob[];
  onRemove: (id: string) => void;
}

export function FileList({ jobs, onRemove }: FileListProps) {
  if (jobs.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {jobs.map((job) => {
        const savings =
          job.status === "done" && job.convertedSize !== undefined
            ? Math.round((1 - job.convertedSize / job.originalSize) * 100)
            : null;

        return (
          <li
            key={job.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-sm font-medium">{job.file.name}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {statusBadge(job)}
                <span>{formatBytes(job.originalSize)}</span>
                {job.status === "done" && job.convertedSize !== undefined && (
                  <>
                    <span>&rarr;</span>
                    <span>{formatBytes(job.convertedSize)}</span>
                    {savings !== null && savings > 0 && (
                      <span className="text-green-600 dark:text-green-500">
                        -{savings}%
                      </span>
                    )}
                  </>
                )}
                {job.status === "error" && job.error && (
                  <span className="text-destructive">{job.error}</span>
                )}
              </div>
              {job.status === "converting" && (
                <Progress value={(job.progress ?? 0) * 100} className="h-1 w-40" />
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {job.status === "done" && job.resultUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={job.resultUrl} download={job.resultFilename}>
                    Download
                  </a>
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => onRemove(job.id)}>
                Remove
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
