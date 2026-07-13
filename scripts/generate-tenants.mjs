/**
 * Generates public/tenants.json — offline fallback for tenant resolution,
 * mirroring the server chain:
 *   hostname --(config/config.properties)--> bankId
 *   bankId   --(properties/messages/bankid_hash_en.properties)--> resource folder
 *
 * Primary runtime resolver is GET /bank_id (backend). This map is only used
 * when that endpoint is unreachable. Re-run when a tenant is added:
 *   npm run tenants
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceResources = join(
  __dirname, '..', '..',
  'admin-console-service', 'src', 'main', 'resources'
);

function parseProperties(text) {
  const map = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) continue;
    const m = line.match(/^([^=:\s]+)\s*[=:\s]\s*(.*)$/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}

const hashProps = parseProperties(
  readFileSync(join(serviceResources, 'properties', 'messages', 'bankid_hash_en.properties'), 'utf8')
);
const bankIdToFolder = {};
for (const [k, v] of Object.entries(hashProps)) {
  if (/^\d+$/.test(k)) bankIdToFolder[k] = v;
}

const hostToBankId = {};
const envDirs = readdirSync(serviceResources, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
for (const env of envDirs) {
  const cfg = join(serviceResources, env, 'config', 'config.properties');
  if (!existsSync(cfg)) continue;
  for (const [k, v] of Object.entries(parseProperties(readFileSync(cfg, 'utf8')))) {
    if (k.includes('.') && /^\d+$/.test(v)) hostToBankId[k.toLowerCase()] = v;
  }
}

const tenants = {};
for (const [host, bankId] of Object.entries(hostToBankId)) {
  const folder = bankIdToFolder[bankId];
  if (folder) tenants[host] = { bankId, resourceId: folder };
}

const publicDir = join(__dirname, '..', 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(
  join(publicDir, 'tenants.json'),
  JSON.stringify({ generatedFrom: 'admin-console-service properties files', bankIdToFolder, hosts: tenants }, null, 2)
);
console.log(
  `tenants.json written: ${Object.keys(tenants).length} hostnames, ${Object.keys(bankIdToFolder).length} bank ids`
);
