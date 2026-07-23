import type { ConvertSettings } from "./types";

export interface ConvertFileResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  convertedSize: number;
}

export function convertFile(
  file: File,
  settings: ConvertSettings,
  onProgress?: (fraction: number) => void
): Promise<ConvertFileResult> {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("format", settings.format);
  formData.set("quality", String(settings.quality));
  formData.set("stripMetadata", String(settings.stripMetadata));
  if (settings.maxWidth) formData.set("maxWidth", String(settings.maxWidth));
  if (settings.maxHeight) formData.set("maxHeight", String(settings.maxHeight));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/convert");
    xhr.responseType = "blob";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress((event.loaded / event.total) * 0.5);
      }
    };
    xhr.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(0.5 + (event.loaded / event.total) * 0.5);
      }
    };

    xhr.onload = async () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        let message = `Conversion failed (${xhr.status})`;
        try {
          const text = await (xhr.response as Blob).text();
          const body = JSON.parse(text);
          if (body?.error) message = body.error;
        } catch {
          // ignore body parse failure, keep default message
        }
        reject(new Error(message));
        return;
      }

      const blob = xhr.response as Blob;
      const disposition = xhr.getResponseHeader("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `${file.name}.${settings.format}`;

      const originalSize = Number(xhr.getResponseHeader("X-Original-Size") ?? file.size);
      const convertedSize = Number(xhr.getResponseHeader("X-Converted-Size") ?? blob.size);

      onProgress?.(1);
      resolve({ blob, filename, originalSize, convertedSize });
    };

    xhr.onerror = () => reject(new Error("Network error during conversion"));

    xhr.send(formData);
  });
}
