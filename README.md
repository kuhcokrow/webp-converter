Image converter web app — upload JPG, PNG, GIF, BMP or TIFF images and convert them to modern **WebP** or **AVIF** format.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build   # production build
pnpm start   # run production build
pnpm lint    # eslint
```

## Architecture

Conversion happens server-side via [sharp](https://sharp.pixelplumbing.com/), not in the browser, for better quality/consistency and broader format support.

```
app/
├── page.tsx                    # Converter page (client UI)
└── api/convert/route.ts        # POST /api/convert — thin handler: parse, validate, call service, map errors

components/converter/           # Dropzone, settings panel, file list, orchestrator

lib/
├── converter/                  # Client-side types + fetch helper for the API
└── core/                       # Framework-agnostic conversion logic
    ├── domain/types.ts         # ConversionOptions, ConversionResult, domain errors
    ├── services/               # ImageProcessor interface + ConversionService (orchestration)
    └── adapters/                # SharpImageProcessor (only place that imports sharp) + magic-byte type detection
```

Layering rule: the API route never touches sharp directly — it calls `ConversionService`, which depends on the `ImageProcessor` interface implemented by `SharpImageProcessor`.

### API

`POST /api/convert` — `multipart/form-data` with fields `file`, `format` (`webp` | `avif`), `quality` (1–100). Responds with the converted file as binary, plus `X-Original-Size` / `X-Converted-Size` headers. Errors: `400` invalid input, `413` file too large, `415` unsupported format, `500` unexpected.

Limits: 25 MB per file, 20 files per batch (enforced client-side; server also enforces the size limit). Input type is verified by magic bytes, not file extension.

No database or persistent storage — conversion is in-memory per request.
