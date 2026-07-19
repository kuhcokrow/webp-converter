const SUPPORTED_INPUT_TYPES: Record<string, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
  webp: "image/webp",
};

export function detectImageType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return SUPPORTED_INPUT_TYPES.jpeg;
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return SUPPORTED_INPUT_TYPES.png;
  }
  if (buffer.toString("ascii", 0, 3) === "GIF") {
    return SUPPORTED_INPUT_TYPES.gif;
  }
  if (buffer.toString("ascii", 0, 2) === "BM") {
    return SUPPORTED_INPUT_TYPES.bmp;
  }
  if (
    (buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00) ||
    (buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a)
  ) {
    return SUPPORTED_INPUT_TYPES.tiff;
  }
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return SUPPORTED_INPUT_TYPES.webp;
  }

  return null;
}
