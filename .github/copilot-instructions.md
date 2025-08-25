# Calendar-TS AI Development Guide

## Project Overview
A TypeScript Next.js app that generates Czech monthly calendars as PDF downloads. Built with strict TDD principles, featuring comprehensive test coverage across all layers.

## Architecture & Data Flow
- **`src/lib/calendar.ts`** - Core calendar logic with Czech localization (months/days)
- **`src/lib/pdf-generator.ts`** - PDF creation using pdf-lib with A4 landscape layout
- **`src/lib/fonts.ts`** - ASCII-safe Czech text for standard PDF fonts
- **`src/app/api/generate/route.ts`** - API endpoint with PDF caching in `.cache/` directory
- **`src/components/CalendarForm.tsx`** - Client-side form with blob download handling

Data flows: User input → API validation → Calendar data generation → PDF creation → File download

## Testing Strategy & Environment Switching
Uses **Jest with custom environment switcher** (`jest-environment-switcher.js`):
- API tests (`/api/` paths) run in Node.js environment for server-side testing
- Component tests run in JSDOM environment for DOM manipulation
- All tests follow TDD pattern: write failing test first, implement minimal solution, refactor

```bash
npm test src/lib                    # Core library tests
npm test src/components             # Component tests  
npm test src/app/api               # API tests (Node.js env)
```

## Czech Localization Patterns
Two sets of constants for Czech text:
- **`CZECH_MONTHS`/`CZECH_DAYNAMES`** - Full Unicode Czech (UI display)
- **`CZECH_MONTHS_ASCII`/`CZECH_DAYNAMES_ASCII`** - ASCII-safe versions (PDF generation)

Always use ASCII versions in PDF generation to avoid font encoding issues with standard fonts.

## API Design & Caching
- **Endpoint**: `GET /api/generate?month=8&year=2025`
- **Validation**: Month (1-12), Year (1900-2100)
- **Caching**: PDFs cached in `.cache/kalendar_YYYY-MM.pdf` with filesystem checks
- **Response**: Direct PDF download with proper Content-Disposition headers

## PDF Generation Specifics
- **Format**: A4 landscape (842x595 points)
- **Grid Layout**: 7 columns (days) × dynamic rows (weeks + header)
- **Colors**: Header (gray 0.9), weekends (gray 0.95), borders (black)
- **Fonts**: HelveticaBold (titles), Helvetica (text) - no custom font embedding

## Development Commands
```bash
npm run dev --turbopack          # Development server (Turbopack enabled)
npm run build --turbopack        # Production build (Turbopack enabled)
npm test:watch                   # Watch mode for TDD workflow
```

## Key Conventions
- **TDD First**: Always write tests before implementation
- **TypeScript Strict**: Full type coverage, interfaces for all data structures
- **Error Handling**: API returns proper HTTP status codes with JSON error messages
- **File Naming**: Test files in `__tests__/` subdirectories, `.test.ts` suffix
- **Component Structure**: Client components marked with `'use client'` directive

## Critical Dependencies
- **pdf-lib**: PDF generation (no external binaries required)
- **@testing-library/react**: Component testing with React 19 support
- **Next.js 15.5**: App Router with Turbopack integration
- **Tailwind CSS 4**: Utility-first styling
