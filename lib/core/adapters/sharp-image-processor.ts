import sharp from "sharp";
import { InvalidImageError, UnsupportedFormatError } from "../domain/types";
import type { ConversionOptions } from "../domain/types";
import type { ImageProcessor, ProcessedImage } from "../services/image-processor";

const CONTENT_TYPES: Record<ConversionOptions["format"], string> = {
  webp: "image/webp",
  avif: "image/avif",
};

export class SharpImageProcessor implements ImageProcessor {
  async process(input: Buffer, options: ConversionOptions): Promise<ProcessedImage> {
    const { format, quality, maxWidth, maxHeight, stripMetadata = true } = options;

    let pipeline;
    try {
      pipeline = sharp(input, { animated: true, failOn: "truncated" });
      await pipeline.metadata();
    } catch {
      throw new InvalidImageError();
    }

    if (maxWidth || maxHeight) {
      pipeline = pipeline.resize({
        width: maxWidth,
        height: maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (stripMetadata) {
      pipeline = pipeline.withMetadata({ exif: {} });
    } else {
      pipeline = pipeline.withMetadata();
    }

    switch (format) {
      case "webp":
        pipeline = pipeline.webp({ quality });
        break;
      case "avif":
        pipeline = pipeline.avif({ quality });
        break;
      default:
        throw new UnsupportedFormatError(`Output format "${format}" is not supported`);
    }

    try {
      const buffer = await pipeline.toBuffer();
      return { buffer, contentType: CONTENT_TYPES[format] };
    } catch {
      throw new InvalidImageError("Failed to encode the converted image");
    }
  }
}
