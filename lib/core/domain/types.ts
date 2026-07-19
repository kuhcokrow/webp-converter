export type OutputFormat = "webp" | "avif";

export interface ConversionOptions {
  format: OutputFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  stripMetadata?: boolean;
}

export interface ConversionInput {
  buffer: Buffer;
  originalFilename: string;
  options: ConversionOptions;
}

export interface ConversionResult {
  buffer: Buffer;
  filename: string;
  contentType: string;
  originalSize: number;
  convertedSize: number;
}

export class UnsupportedFormatError extends Error {
  constructor(message = "Unsupported image format") {
    super(message);
    this.name = "UnsupportedFormatError";
  }
}

export class FileTooLargeError extends Error {
  constructor(message = "File exceeds the maximum allowed size") {
    super(message);
    this.name = "FileTooLargeError";
  }
}

export class InvalidImageError extends Error {
  constructor(message = "File could not be read as a valid image") {
    super(message);
    this.name = "InvalidImageError";
  }
}
