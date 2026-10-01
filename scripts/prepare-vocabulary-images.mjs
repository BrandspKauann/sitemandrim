import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const manifest = JSON.parse(await readFile(process.argv[2], 'utf8'));
const destination = path.resolve('public/images/vocabulary-game');
await mkdir(destination, { recursive: true });
for (const item of manifest) {
  await sharp(item.path).resize(640, 640, { fit: 'contain', background: '#fffaf4' }).webp({ quality: 84 }).toFile(path.join(destination, `${item.id}.webp`));
}
console.log(`Prepared ${manifest.length} vocabulary illustrations.`);
if (process.argv[3]) {
  const columns = 6;
  const tiles = await Promise.all(manifest.map(async (item, index) => ({
    input: await sharp(path.join(destination, `${item.id}.webp`)).resize(160, 160).extend({ bottom: 28, background: '#fffaf4' }).composite([{ input: Buffer.from(`<svg width="160" height="28"><text x="80" y="20" text-anchor="middle" font-family="sans-serif" font-size="12">${item.id}</text></svg>`), top: 160, left: 0 }]).png().toBuffer(),
    left: index % columns * 160,
    top: Math.floor(index / columns) * 188,
  })));
  await sharp({ create: { width: columns * 160, height: Math.ceil(manifest.length / columns) * 188, channels: 3, background: '#fffaf4' } }).composite(tiles).png().toFile(process.argv[3]);
}
