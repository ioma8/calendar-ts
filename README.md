# Czech Calendar - TypeScript Next.js Version

A modern TypeScript rewrite of the Czech calendar generator using Next.js, built with Test-Driven Development (TDD) principles.

## Features

- ✅ **Modern UI design** with glassmorphism and gradient effects
- ✅ **Quick download tables** for current and next year months
- ✅ **Current month highlighting** for easy identification
- ✅ **Generates Czech monthly calendars** in PDF format (A4 landscape)
- ✅ **Web interface** with month/year selection
- ✅ **PDF download** functionality via API
- ✅ **Fully typed** with TypeScript
- ✅ **Comprehensive tests** written with TDD approach
- ✅ **Vercel-ready** deployment
- ✅ **Responsive design** with Tailwind CSS

## Getting Started

### Development
```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm test          # Run all tests
npm run build     # Build for production
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Architecture

### Core Libraries (`src/lib/`)
- **`calendar.ts`** - Calendar data generation, Czech month/day names
- **`pdf-generator.ts`** - PDF creation using pdf-lib
- **`fonts.ts`** - Font handling and ASCII-safe Czech text

### API Routes (`src/app/api/`)
- **`/api/generate`** - PDF generation endpoint with validation

### React Components (`src/components/`)
- **`CalendarForm`** - Month/year selection form with download handling

## Testing

Built with comprehensive test coverage using Jest and React Testing Library:
```bash
npm test src/lib                    # Core library tests
npm test src/components             # Component tests  
npm test src/app/api               # API tests
```

## TDD Implementation

This project was built using Test-Driven Development:

1. **Red** - Write failing tests first
2. **Green** - Implement minimal code to pass tests
3. **Refactor** - Improve code while keeping tests green

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Next.js and deploy
3. No additional configuration needed

## API Usage

### Generate Calendar PDF
```
GET /api/generate?month=8&year=2025
```

**Parameters:**
- `month` - Month number (1-12)
- `year` - Year (1900-2100)

**Response:**
- PDF file download with filename `kalendar_YYYY-MM.pdf`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
