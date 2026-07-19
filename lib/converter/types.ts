export type OutputFormat = "webp" | "avif";

export type FileJobStatus = "pending" | "converting" | "done" | "error";

export interface FileJob {
  id: string;
  file: File;
  status: FileJobStatus;
  error?: string;
  originalSize: number;
  convertedSize?: number;
  resultUrl?: string;
  resultFilename?: string;
}

export interface ConvertSettings {
  format: OutputFormat;
  quality: number;
}

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
export const MAX_FILES = 20;
export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/webp",
];
