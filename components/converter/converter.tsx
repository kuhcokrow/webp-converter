"use client";

import * as React from "react";
import { Dropzone } from "./dropzone";
import { SettingsPanel } from "./settings-panel";
import { FileList } from "./file-list";
import { convertFile } from "@/lib/converter/convert-file";
import { zipResults } from "@/lib/converter/zip-results";
import { MAX_FILE_SIZE, MAX_FILES } from "@/lib/converter/types";
import type { ConvertSettings, FileJob } from "@/lib/converter/types";

export function Converter() {
  const [jobs, setJobs] = React.useState<FileJob[]>([]);
  const [settings, setSettings] = React.useState<ConvertSettings>({
    format: "webp",
    quality: 80,
    stripMetadata: true,
  });
  const [globalError, setGlobalError] = React.useState<string | null>(null);
  const [zipping, setZipping] = React.useState(false);

  const isConverting = jobs.some((j) => j.status === "converting");

  const addFiles = (files: File[]) => {
    setGlobalError(null);

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    const accepted = files.filter((f) => f.size <= MAX_FILE_SIZE);

    if (oversized.length > 0) {
      setGlobalError(
        `${oversized.length} file(s) exceed the 25 MB limit and were skipped.`
      );
    }

    setJobs((prev) => {
      const room = MAX_FILES - prev.length;
      if (room <= 0) {
        setGlobalError(`Maximum of ${MAX_FILES} files per batch reached.`);
        return prev;
      }
      const toAdd = accepted.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: "pending" as const,
        originalSize: file.size,
      }));
      if (accepted.length > toAdd.length) {
        setGlobalError(`Maximum of ${MAX_FILES} files per batch — some files were skipped.`);
      }
      return [...prev, ...toAdd];
    });
  };

  const removeJob = (id: string) => {
    setJobs((prev) => {
      const job = prev.find((j) => j.id === id);
      if (job?.resultUrl) URL.revokeObjectURL(job.resultUrl);
      return prev.filter((j) => j.id !== id);
    });
  };

  const convertAll = async () => {
    const pending = jobs.filter((j) => j.status === "pending" || j.status === "error");

    for (const job of pending) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, status: "converting", error: undefined, progress: 0 } : j
        )
      );

      try {
        const result = await convertFile(job.file, settings, (progress) => {
          setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, progress } : j)));
        });
        const resultUrl = URL.createObjectURL(result.blob);
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: "done",
                  convertedSize: result.convertedSize,
                  resultUrl,
                  resultFilename: result.filename,
                  resultBlob: result.blob,
                }
              : j
          )
        );
      } catch (error) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: "error",
                  error: error instanceof Error ? error.message : "Conversion failed",
                }
              : j
          )
        );
      }
    }
  };

  const hasConvertibleJobs = jobs.some((j) => j.status === "pending" || j.status === "error");
  const doneJobs = jobs.filter((j) => j.status === "done");

  const downloadAllAsZip = async () => {
    setZipping(true);
    try {
      const blob = await zipResults(doneJobs);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted-images.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Dropzone onFiles={addFiles} disabled={isConverting} />
      <SettingsPanel settings={settings} onChange={setSettings} disabled={isConverting} />

      {globalError && (
        <p role="alert" className="text-sm text-destructive">
          {globalError}
        </p>
      )}

      <FileList jobs={jobs} onRemove={removeJob} />

      {jobs.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={convertAll}
            disabled={!hasConvertibleJobs || isConverting}
            className="self-start rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors disabled:pointer-events-none disabled:opacity-50"
          >
            {isConverting ? "Converting…" : `Convert ${jobs.length} file(s)`}
          </button>

          {doneJobs.length > 1 && (
            <button
              onClick={downloadAllAsZip}
              disabled={zipping}
              className="self-start rounded-lg border border-border px-6 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              {zipping ? "Zipping…" : `Download all as ZIP (${doneJobs.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
