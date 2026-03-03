import { head, put } from '@vercel/blob';
import { generateCalendarPdf } from '../src/lib/pdf-generator';

const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function ensureMonthCached(year: number, month: number): Promise<'hit' | 'generated'> {
  const paddedMonth = String(month).padStart(2, '0');
  const pathname = `calendar-pdf/${year}/${paddedMonth}.pdf`;

  try {
    await head(pathname);
    return 'hit';
  } catch {
    const pdfBytes = await generateCalendarPdf({ year, month });
    await put(pathname, Buffer.from(pdfBytes), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/pdf',
    });
    return 'generated';
  }
}

async function main(): Promise<void> {
  if (!hasBlobToken) {
    console.log('[prewarm] Skipping: BLOB_READ_WRITE_TOKEN is not set.');
    return;
  }

  const now = new Date();
  const years = [now.getFullYear(), now.getFullYear() + 1];

  let hits = 0;
  let generated = 0;

  for (const year of years) {
    for (let month = 1; month <= 12; month += 1) {
      const result = await ensureMonthCached(year, month);
      if (result === 'hit') {
        hits += 1;
      } else {
        generated += 1;
      }
    }
  }

  console.log(`[prewarm] Done. cache hits=${hits}, generated=${generated}`);
}

main().catch((error) => {
  console.error('[prewarm] Failed:', error);
  process.exit(1);
});
