import { NextRequest, NextResponse } from 'next/server';
import { del, list } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const BLOB_PREFIX = 'calendar-pdf/';

async function clearBlobCache(): Promise<number> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return 0;
  }

  let cursor: string | undefined;
  let deleted = 0;

  do {
    const response = await list({ prefix: BLOB_PREFIX, limit: 1000, cursor });
    if (response.blobs.length > 0) {
      await del(response.blobs.map((blob) => blob.pathname));
      deleted += response.blobs.length;
    }
    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return deleted;
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.CACHE_CLEAR_TOKEN;
  const providedToken = request.headers.get('x-cache-clear-token');

  if (!expectedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blobDeleted = await clearBlobCache();

    return NextResponse.json({
      ok: true,
      blobDeleted,
    });
  } catch (error) {
    console.error('Cache clear failed:', error);
    return NextResponse.json({ error: 'Cache clear failed' }, { status: 500 });
  }
}
