import type { ConvertSettings } from "./types";

export interface ConvertFileResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  convertedSize: number;
}

export async function convertFile(
  file: File,
  settings: ConvertSettings
): Promise<ConvertFileResult> {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("format", settings.format);
  formData.set("quality", String(settings.quality));

  const response = await fetch("/api/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = `Conversion failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore body parse failure, keep default message
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? `${file.name}.${settings.format}`;

  const originalSize = Number(response.headers.get("X-Original-Size") ?? file.size);
  const convertedSize = Number(response.headers.get("X-Converted-Size") ?? blob.size);

  return { blob, filename, originalSize, convertedSize };
}
