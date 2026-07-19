import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ConversionService,
  SharpImageProcessor,
  detectImageType,
  FileTooLargeError,
  InvalidImageError,
  UnsupportedFormatError,
} from "@/lib/core";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const optionsSchema = z.object({
  format: z.enum(["webp", "avif"]),
  quality: z.coerce.number().int().min(1).max(100),
  maxWidth: z.coerce.number().int().positive().optional(),
  maxHeight: z.coerce.number().int().positive().optional(),
  stripMetadata: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v !== "false"),
});

const service = new ConversionService(new SharpImageProcessor());

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart/form-data request" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing required field: file" }, { status: 400 });
  }

  const parsed = optionsSchema.safeParse({
    format: formData.get("format") ?? undefined,
    quality: formData.get("quality") ?? undefined,
    maxWidth: formData.get("maxWidth") ?? undefined,
    maxHeight: formData.get("maxHeight") ?? undefined,
    stripMetadata: formData.get("stripMetadata") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid conversion options", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File exceeds the maximum allowed size (25 MB)" },
      { status: 413 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!detectImageType(buffer)) {
    return NextResponse.json(
      { error: "Unsupported or unrecognized image format" },
      { status: 415 }
    );
  }

  try {
    const result = await service.convert({
      buffer,
      originalFilename: file.name,
      options: parsed.data,
    });

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "X-Original-Size": String(result.originalSize),
        "X-Converted-Size": String(result.convertedSize),
      },
    });
  } catch (error) {
    if (error instanceof UnsupportedFormatError) {
      return NextResponse.json({ error: error.message }, { status: 415 });
    }
    if (error instanceof FileTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }
    if (error instanceof InvalidImageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Unexpected error during image conversion", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
