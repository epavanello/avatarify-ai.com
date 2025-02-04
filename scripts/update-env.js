import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getPublicUrl() {
  return new Promise((resolve, reject) => {
    exec('curl -s http://127.0.0.1:4040/api/tunnels', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      try {
        const data = JSON.parse(stdout);
        const url = data.tunnels[0]?.public_url;
        if (!url) {
          reject(new Error('No tunnel URL found'));
          return;
        }
        resolve(url.replace('http://', 'https://'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function updateEnvFile(url) {
  const envPath = path.join(__dirname, '..', '.env');
  let content = '';

  try {
    content = await fs.readFile(envPath, 'utf8');
  } catch (err) {
    // File doesn't exist, that's ok
  }

  const newContent =
    content.replace(/^PUBLIC_WEBSITE_HOST=.*$/m, `PUBLIC_WEBSITE_HOST=${url}`) ||
    `PUBLIC_WEBSITE_HOST=${url}`;

  await fs.writeFile(envPath, newContent);
  console.log(`Updated .env with PUBLIC_WEBSITE_HOST=${url}`);
}

// Wait for ngrok to start
setTimeout(async () => {
  try {
    const url = await getPublicUrl();
    await updateEnvFile(url);
  } catch (err) {
    console.error('Failed to update .env:', err.message);
  }
}, 5000); // Wait 5 seconds for ngrok to start
