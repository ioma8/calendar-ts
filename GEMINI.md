# Czech Calendar - TypeScript Next.js Version

A modern TypeScript rewrite of the Czech calendar generator using Next.js, built with Test-Driven Development (TDD) principles.

## Project Overview

This project is a Next.js application written in TypeScript that generates monthly calendars in PDF format. The calendars are in Czech and formatted for A4 landscape. The application provides a web interface for users to select the month and year, and then download the corresponding calendar as a PDF file.

The core technologies used are:

*   **Next.js:** A React framework for building server-side rendered and static web applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **React:** A JavaScript library for building user interfaces.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **pdf-lib:** A JavaScript library for creating and modifying PDF documents.
*   **Jest:** A JavaScript testing framework.

## Building and Running

### Prerequisites

*   Node.js and npm (or a compatible package manager)

### Installation

```bash
npm install
```

### Development

To run the development server:

```bash
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production:

```bash
npm run build
```

### Testing

To run the tests:

```bash
npm test
```

## Development Conventions

*   **TypeScript:** The entire codebase is written in TypeScript, and type safety is enforced.
*   **TDD:** The project was developed using a Test-Driven Development approach. Tests are located in `__tests__` directories alongside the files they test.
*   **Component-Based Architecture:** The frontend is built with React components, located in the `src/components` directory.
*   **API Routes:** The backend logic is implemented using Next.js API routes, located in the `src/app/api` directory.
*   **Linting:** ESLint is used for code linting. The configuration is in `eslint.config.mjs`.
*   **Styling:** Tailwind CSS is used for styling. The configuration is in `tailwind.config.ts` and `postcss.config.mjs`.

## Key Files

*   `src/app/page.tsx`: The main page of the application, which renders the `CalendarForm` component.
*   `src/components/CalendarForm.tsx`: The React component for the calendar selection form.
*   `src/app/api/generate/route.ts`: The API route that generates the PDF calendar.
*   `src/lib/calendar.ts`: The core logic for generating the calendar data.
*   `src/lib/pdf-generator.ts`: The logic for generating the PDF using `pdf-lib`.
*   `src/lib/fonts.ts`: Handles font loading and ASCII-safe Czech text for the PDF.
*   `package.json`: Defines the project's dependencies and scripts.
*   `jest.config.js`: The configuration for the Jest testing framework.
*   `next.config.ts`: The configuration for the Next.js framework.
*   `tsconfig.json`: The configuration for the TypeScript compiler.
