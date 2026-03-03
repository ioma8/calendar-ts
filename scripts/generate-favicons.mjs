import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import favicons from 'favicons';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const source = path.join(rootDir, 'public', 'icon.svg');
const outDir = path.join(rootDir, 'public');

const configuration = {
  path: '/',
  appName: 'Český Kalendář',
  appShortName: 'Kalendář',
  appDescription: 'Online generátor českých měsíčních kalendářů s exportem do PDF.',
  developerName: 'Jakub Kolčář',
  developerURL: null,
  dir: 'auto',
  lang: 'cs-CZ',
  background: '#2563eb',
  theme_color: '#2563eb',
  display: 'standalone',
  orientation: 'any',
  start_url: '/',
  version: '1.0',
  pixel_art: false,
  loadManifestWithCredentials: false,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: false,
    yandex: false,
  },
};

const response = await favicons(source, configuration);

const keepFiles = new Set([
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'site.webmanifest',
]);

for (const image of response.images) {
  if (keepFiles.has(image.name)) {
    await fs.writeFile(path.join(outDir, image.name), image.contents);
  }
}

for (const file of response.files) {
  if (file.name === 'site.webmanifest') {
    await fs.writeFile(path.join(outDir, file.name), file.contents);
  }
}
