import JSZip from "jszip";
import type { FileJob } from "./types";

export async function zipResults(jobs: FileJob[]): Promise<Blob> {
  const zip = new JSZip();

  for (const job of jobs) {
    if (job.status === "done" && job.resultBlob && job.resultFilename) {
      zip.file(job.resultFilename, job.resultBlob);
    }
  }

  return zip.generateAsync({ type: "blob" });
}
