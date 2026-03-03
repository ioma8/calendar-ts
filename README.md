# Cesky Kalendar (Next.js + TypeScript)

Online generator ceskych mesicnich kalendaru s exportem do PDF.

## Features

- Generate monthly Czech calendars as PDF (A4 landscape)
- Quick month/year selection UI
- Current and next year quick tables
- Typed API route for PDF generation (`/api/generate`)
- Production metadata and social cards (Open Graph + Twitter)
- Full favicon/app icon set generated from project icon source

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Build and Test

```bash
npm test
npm run build
```

## API

Generate PDF:

```http
GET /api/generate?month=8&year=2025
```

Parameters:
- `month`: 1-12
- `year`: 1900-2100

Response:
- `application/pdf` attachment (`kalendar_YYYY-MM.pdf`)

## Branding and Icons

- Source icon: `public/icon.svg`
- Generated assets: `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png`
- Regenerate icons:

```bash
node scripts/generate-favicons.mjs
```

## Deployment

- Recommended: Vercel
- Current metadata base URL: `https://kalendarpdf.cz`

## Vercel Readiness Notes

- Rendering:
  - Home page is prerendered as static content.
  - PDF generation API uses Node.js runtime (`src/app/api/generate/route.ts`).
- Caching:
  - `/api/generate` uses Vercel Blob as shared persistent cache with deterministic keys (`calendar-pdf/<year>/<month>.pdf`).
  - If a cached blob exists, PDF generation is skipped and cached bytes are returned.
  - If Blob token is missing (local dev), PDFs are generated on demand.
  - Runtime logs include cache source (`served-from-blob` or `generated`).
  - Blob cache requires `BLOB_READ_WRITE_TOKEN` in Vercel project environment variables.
  - During build (`postbuild`), cache is prewarmed for all months of the current and next year (`scripts/prewarm-pdf-cache.ts`).
  - Route also sets CDN cache headers for fast global delivery.
- Observability:
  - Vercel Analytics integrated in root layout.
  - Vercel Speed Insights integrated in root layout.
- Security defaults:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Powered-By` header disabled.

## Support

- Buy me a coffee: https://buymeacoffee.com/ioma8
