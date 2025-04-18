import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Free music URLs (these are popular royalty-free options)
const musicUrls = [
  // Original happy birthday music (already downloaded)
  { url: 'https://ext.same-assets.com/1648234881/3756840584.mpga', filename: 'angelbabydj.mp3' },

  // Additional music options
  { url: 'https://dl.dropboxusercontent.com/scl/fi/0ek9s53ztx6sbdwwjtlg2/bday-happy.mp3?rlkey=vryfnkb7jyjvl5cyjpgc9fwn7&dl=0', filename: 'happy.mp3' },
  { url: 'https://dl.dropboxusercontent.com/scl/fi/pthxe8ujq9uiwsfdz7v4e/bday-jazzy.mp3?rlkey=zf3fqzpxd8juzk7r54o7xjjh4&dl=0', filename: 'jazzy.mp3' },
  { url: 'https://dl.dropboxusercontent.com/scl/fi/16u5y9gjkk5u3vk0zv2kq/bday-piano.mp3?rlkey=kx0jnb9ue9hn2vj45ueznvdyj&dl=0', filename: 'piano.mp3' },
];

const musicDir = path.join(__dirname, 'public', 'assets', 'music');

if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir, { recursive: true });
}

musicUrls.forEach(({ url, filename }) => {
  const filePath = path.join(musicDir, filename);

  console.log(`Downloading ${url} to ${filePath}`);

  const file = fs.createWriteStream(filePath);

  https.get(url, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});
