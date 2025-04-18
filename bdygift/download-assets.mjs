import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetUrls = [
  // SVG for click button
  'https://ext.same-assets.com/1648234881/3783633550.svg',

  // GIFs for animations
  'https://ext.same-assets.com/1648234881/2540092336.gif', // st1
  'https://ext.same-assets.com/1648234881/261792078.gif',  // st2
  'https://ext.same-assets.com/1648234881/1599181906.gif', // st3
  'https://ext.same-assets.com/1648234881/1677651866.gif', // st4
  'https://ext.same-assets.com/1648234881/37994365.gif',   // st5
  'https://ext.same-assets.com/1648234881/2067421943.gif', // stickerNo

  // Background image
  'https://ext.same-assets.com/1648234881/2097958345.jpeg', // wpeach.jpg

  // Font
  'https://ext.same-assets.com/1648234881/2591850583.woff2', // itim font

  // Music
  'https://ext.same-assets.com/1648234881/3756840584.mpga', // angelbabydj.mp3
];

const assetsDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function getFileName(url) {
  // Extract the numeric ID from the URL
  const match = url.match(/\/(\d+)\.(svg|gif|jpeg|woff2|mpga)$/);
  if (!match) return path.basename(url);

  const id = match[1];
  const ext = match[2];

  // Map specific IDs to filenames
  const fileMap = {
    '3783633550': 'search.svg',
    '2540092336': 'st1.gif',
    '261792078': 'st2.gif',
    '1599181906': 'st3.gif',
    '1677651866': 'st4.gif',
    '37994365': 'st5.gif',
    '2067421943': 'stickerNo.gif',
    '2097958345': 'wpeach.jpg',
    '2591850583': 'itim.woff2',
    '3756840584': 'angelbabydj.mp3'
  };

  return fileMap[id] || `${id}.${ext}`;
}

assetUrls.forEach(url => {
  const fileName = getFileName(url);
  const filePath = path.join(assetsDir, fileName);

  console.log(`Downloading ${url} to ${filePath}`);

  const file = fs.createWriteStream(filePath);

  https.get(url, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${fileName}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});
