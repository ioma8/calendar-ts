import { NextRequest, NextResponse } from 'next/server';
import { head, put } from '@vercel/blob';
import { generateCalendarPdf } from '@/lib/pdf-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'CDN-Cache-Control': 'public, max-age=31536000, immutable',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=604800',
};

async function getCachedPdf(pathname: string): Promise<Uint8Array | null> {
  try {
    const blob = await head(pathname);
    const response = await fetch(blob.url, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    return new Uint8Array(await response.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const paddedMonth = month.toString().padStart(2, '0');
    const filename = `kalendar_${year}-${paddedMonth}.pdf`;
    const blobPathname = `calendar-pdf/${year}/${paddedMonth}.pdf`;
    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    if (hasBlobToken) {
      const cachedPdf = await getCachedPdf(blobPathname);
      if (cachedPdf) {
        console.info(`[pdf-cache] served-from-blob year=${year} month=${paddedMonth}`);
        return new NextResponse(new Uint8Array(cachedPdf), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            ...CACHE_HEADERS,
          },
        });
      }
    }

    const pdfBuffer = await generateCalendarPdf({ year, month });
    console.info(`[pdf-cache] generated year=${year} month=${paddedMonth}`);

    if (hasBlobToken) {
      await put(blobPathname, Buffer.from(pdfBuffer), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/pdf',
      });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        ...CACHE_HEADERS,
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
