import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const output = path.join(root, 'intelliblock-v0.1.0-store.zip');

if (!fs.existsSync(dist)) throw new Error('dist/ does not exist; run npm run build first.');
const manifestPath = path.join(dist, 'manifest.json');
if (!fs.existsSync(manifestPath)) throw new Error('dist/manifest.json is missing.');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('The package must use Manifest V3.');
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error(`Invalid extension version: ${manifest.version}`);
for (const relative of ['background.js', 'content.js', 'src/options.html', 'src/dashboard.html', 'icons/icon16.png', 'icons/icon32.png', 'icons/icon48.png', 'icons/icon128.png']) {
  if (!fs.existsSync(path.join(dist, relative))) throw new Error(`Required bundle file is missing: ${relative}`);
}

const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(dist, absolute).split(path.sep).join('/');
    if (entry.isDirectory()) walk(absolute);
    else files.push(relative);
  }
}
walk(dist);

const forbiddenExtension = /\.(env(?:\..*)?|pem|key|p12|zip)$/i;
const forbiddenName = /(^|\/)(credentials?|secrets?)(\.|\/|$)/i;
const forbiddenFiles = files.filter((file) => {
  const segments = file.split('/').map((segment) => segment.toLowerCase());
  return segments.includes('node_modules') || segments.includes('.git') || forbiddenExtension.test(file) || forbiddenName.test(file);
});
if (forbiddenFiles.length) throw new Error(`Forbidden files in dist/: ${forbiddenFiles.join(', ')}`);

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function u16(value) { const b = Buffer.alloc(2); b.writeUInt16LE(value, 0); return b; }
function u32(value) { const b = Buffer.alloc(4); b.writeUInt32LE(value >>> 0, 0); return b; }
function header(signature, values) { return Buffer.concat([u32(signature), ...values]); }

const localParts = [];
const centralParts = [];
let offset = 0;
for (const relative of files.sort()) {
  const name = Buffer.from(relative, 'utf8');
  const raw = fs.readFileSync(path.join(dist, relative));
  const compressed = deflateRawSync(raw, { level: 9 });
  const checksum = crc32(raw);
  const local = header(0x04034b50, [u16(20), u16(0), u16(8), u16(0), u16(0), u32(checksum), u32(compressed.length), u32(raw.length), u16(name.length), u16(0), name, compressed]);
  localParts.push(local);
  const central = header(0x02014b50, [u16(20), u16(20), u16(0), u16(8), u16(0), u16(0), u32(checksum), u32(compressed.length), u32(raw.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name]);
  centralParts.push(central);
  offset += local.length;
}

const centralDirectory = Buffer.concat(centralParts);
const localData = Buffer.concat(localParts);
const end = header(0x06054b50, [u16(0), u16(0), u16(files.length), u16(files.length), u32(centralDirectory.length), u32(localData.length), u16(0)]);
fs.writeFileSync(output, Buffer.concat([localData, centralDirectory, end]));
console.log(`Prepared ${path.basename(output)} from ${files.length} files.`);
console.log('This command does not upload or publish the extension.');
