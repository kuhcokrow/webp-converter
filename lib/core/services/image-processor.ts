import type { ConversionOptions } from "../domain/types";

export interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
}

export interface ImageProcessor {
  process(input: Buffer, options: ConversionOptions): Promise<ProcessedImage>;
}
