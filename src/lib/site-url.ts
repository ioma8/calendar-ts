const DEFAULT_SITE_URL = 'https://kalendarpdf.cz';

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return candidate ? normalizeUrl(candidate) : DEFAULT_SITE_URL;
}

