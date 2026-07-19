import { InvalidImageError } from "../domain/types";
import type { ConversionInput, ConversionResult } from "../domain/types";
import type { ImageProcessor } from "./image-processor";

function sanitizeBaseName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "image";
  const withoutExt = base.replace(/\.[^.]+$/, "");
  const safe = withoutExt.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return safe.length > 0 ? safe : "image";
}

export class ConversionService {
  constructor(private readonly processor: ImageProcessor) {}

  async convert(input: ConversionInput): Promise<ConversionResult> {
    const { buffer, originalFilename, options } = input;

    let processed;
    try {
      processed = await this.processor.process(buffer, options);
    } catch (error) {
      if (error instanceof InvalidImageError) throw error;
      throw new InvalidImageError();
    }

    const baseName = sanitizeBaseName(originalFilename);
    const filename = `${baseName}.${options.format}`;

    return {
      buffer: processed.buffer,
      filename,
      contentType: processed.contentType,
      originalSize: buffer.byteLength,
      convertedSize: processed.buffer.byteLength,
    };
  }
}
