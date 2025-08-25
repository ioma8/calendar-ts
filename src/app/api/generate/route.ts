import { NextRequest, NextResponse } from 'next/server';
import { generateCalendarPdf } from '@/lib/pdf-generator';
import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.resolve(process.cwd(), '.cache');

async function ensureCacheDirExists() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureCacheDirExists();
    const { searchParams } = new URL(request.url);
    const monthStr = searchParams.get('month');
    const yearStr = searchParams.get('year');

    if (!monthStr || !yearStr) {
      return NextResponse.json(
        { error: 'Parametry měsíc a rok jsou povinné' },
        { status: 400 }
      );
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Neplatný měsíc. Musí být mezi 1 a 12' },
        { status: 400 }
      );
    }

    if (isNaN(year) || year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: 'Neplatný rok. Musí být mezi 1900 a 2100' },
        { status: 400 }
      );
    }

    const filename = `kalendar_${year}-${month.toString().padStart(2, '0')}.pdf`;
    const cachedFilePath = path.join(CACHE_DIR, filename);

    try {
      await fs.access(cachedFilePath);
      const cachedPdf = await fs.readFile(cachedFilePath);
      return new NextResponse(cachedPdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch {
      // File doesn't exist, generate it
    }

    const pdfBuffer = await generateCalendarPdf({ year, month });
    await fs.writeFile(cachedFilePath, pdfBuffer);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}
