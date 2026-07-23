import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/images');
const iconsDir = path.join(__dirname, '../public/icons');

async function optimize() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.error('Sharp not available yet:', err.message);
    return;
  }

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const filePath = path.join(imagesDir, file);
    const basename = path.basename(file, ext);
    const webpPath = path.join(imagesDir, `${basename}.webp`);

    console.log(`Optimizing ${file}...`);

    try {
      // Create WebP version
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(webpPath);

      console.log(`  -> Created ${basename}.webp`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message);
    }
  }

  // Generate PWA Icons from logo.png if it exists
  const logoPath = path.join(imagesDir, 'logo.png');
  if (fs.existsSync(logoPath)) {
    console.log('Generating PWA icons from logo.png...');
    await sharp(logoPath)
      .resize(192, 192, { fit: 'contain', background: { r: 26, g: 19, b: 8, alpha: 1 } })
      .png()
      .toFile(path.join(iconsDir, 'icon-192.png'));

    await sharp(logoPath)
      .resize(512, 512, { fit: 'contain', background: { r: 26, g: 19, b: 8, alpha: 1 } })
      .png()
      .toFile(path.join(iconsDir, 'icon-512.png'));

    console.log('  -> Created icon-192.png and icon-512.png');
  }
}

optimize();
