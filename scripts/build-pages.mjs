import { cp, link, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { constants } from 'node:fs';

// Keep the source mirror usable locally; adapt URLs only in the Pages output.
const base = process.env.PAGES_BASE_PATH ?? '/jyskren/';
if (!/^\/(?:[\w-]+\/)*$/.test(base)) throw new Error('PAGES_BASE_PATH must start and end with a slash.');
const output = path.resolve('dist');
await rm(output, { recursive: true, force: true });
if (process.env.PAGES_LINK_ASSETS === '1') {
  // Optional disk-saving local check. CI always copies assets normally.
  async function stage(source, target) {
    await mkdir(target, { recursive: true });
    for (const entry of await readdir(source, { withFileTypes: true })) {
      if (entry.name === '.DS_Store') continue;
      const from = path.join(source, entry.name), to = path.join(target, entry.name);
      if (entry.isDirectory()) await stage(from, to);
      else if (/\.(html|css|js|json)$/.test(entry.name)) await cp(from, to);
      else await link(from, to);
    }
  }
  await stage('site', output);
} else {
  await cp('site', output, { recursive: true, mode: constants.COPYFILE_FICLONE, filter: source => path.basename(source) !== '.DS_Store' });
}
const roots = new Set((await readdir('site', { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name));
const routes = new Set();
for (const name of roots) {
  try { await readFile(path.join('site', name, 'index.html')); routes.add(name); } catch {}
}
function rebase(text) {
  // Handles HTML attributes, CSS url(), and literal paths in inline JavaScript.
  text = text.replace(/(["'(=\s])\/(?!\/)([\w-]+)?(?=[\/"'?#\s)]|$)/g, (match, before, first) => {
    if (first && !roots.has(first)) return match;
    return before + base + (first ?? '');
  });
  // Drupal settings use JSON-escaped slashes.
  text = text.replace(/"baseUrl":"\\\/"/g, () => '"baseUrl":' + JSON.stringify(base));
  // Directory links must include a final slash for GitHub Pages.
  text = text.replace(/(href=["'])([^"']+)(["'])/g, (match, before, url, quote) => {
    if (!url.startsWith(base)) return match;
    const relative = url.slice(base.length);
    return routes.has(relative) ? before + url + '/' + quote : match;
  });
  return text;
}
let count = 0;
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await visit(file);
    else if (/\.(html|css|js|json)$/.test(entry.name)) {
      const original = await readFile(file, 'utf8');
      await writeFile(file, rebase(original));
      count++;
    }
  }
}
await visit(output);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Prepared ${count} text assets and ${routes.size + 1} pages for ${base}`);
