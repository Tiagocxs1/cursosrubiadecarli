import { createHmac, createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLOUD = 'dhfek3urm';
const API_KEY = '275461658762582';
const API_SECRET = 'EK9SJyrox9NeNLBcUecfRF9Y6Eg';

function sign(params) {
  // Build "k=v" pairs sorted by key, excluding file/api_key/cloud_name/resource_type
  const toSign = Object.entries(params)
    .filter(([k]) => !['file', 'api_key', 'cloud_name', 'resource_type'].includes(k))
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('&');
  return createHash('sha1').update(toSign + API_SECRET).digest('hex');
}

async function upload(filePath, folder, publicId) {
  const buffer = fs.readFileSync(filePath);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder, public_id: publicId };
  const signature = sign(params);

  const form = new FormData();
  form.append('file', new Blob([buffer]));
  form.append('api_key', API_KEY);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('public_id', publicId);
  form.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
  const res = await fetch(url, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(JSON.stringify(json.error || json));
  }
  return json;
}

function toPublicId(filename) {
  const name = path.parse(filename).name;
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
}

async function main() {
  const target = process.argv[2];
  const folder = process.argv[3];
  if (!target || !folder) {
    console.error('Uso: node cloudinary-rest-upload.mjs <diretorio> <folder>');
    process.exit(1);
  }
  const dir = path.resolve(__dirname, '..', target);
  const EXCLUDE = /^(ads|next|file|globe|window|vercel)\./i;
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|gif|svg)$/i.test(f) && !EXCLUDE.test(f));
  const results = [];
  for (const f of files) {
    const publicId = toPublicId(f);
    try {
      const r = await upload(path.join(dir, f), folder, publicId);
      results.push({ filename: f, public_id: `${folder}/${publicId}`, url: r.secure_url });
      console.log(`OK ${f} -> ${r.secure_url}`);
    } catch (e) {
      console.error(`FAIL ${f}: ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(__dirname, `cloudinary-${target.replace(/[^a-z0-9]/gi, '-')}.json`), JSON.stringify(results, null, 2));
  console.log(`\n${results.length} uploads concluídos em "${folder}"`);
}

main();