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
- Current metadata base URL: `https://czech-calendar.vercel.app`

## Support

- Buy me a coffee: https://buymeacoffee.com/ioma8
