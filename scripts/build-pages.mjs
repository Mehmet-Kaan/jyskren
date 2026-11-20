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
function rebaseUrl(url, directoryLink = false) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const relative = url.slice(1);
  const [pathname] = relative.split(/[?#]/, 1);
  if (pathname && !roots.has(pathname.split('/')[0])) return url;
  if (directoryLink && routes.has(pathname)) {
    return base + pathname + '/' + relative.slice(pathname.length);
  }
  return base + relative;
}

function rebaseCss(text) {
  return text.replace(/(url\(\s*)(["']?)(\/[^\s"')]+)\2/g, (_, start, quote, url) =>
    start + quote + rebaseUrl(url) + quote);
}

function rebaseHtml(text) {
  text = text.replace(/(\s)(href|src|action|srcset)=(["'])([^"']*)\3/g,
    (_, space, attribute, quote, value) => {
      const url = attribute === 'srcset'
        ? value.replace(/(^|,\s*)(\/[^\s,]+)/g, (_, separator, candidate) =>
          separator + rebaseUrl(candidate))
        : rebaseUrl(value, attribute === 'href');
      return space + attribute + '=' + quote + url + quote;
    });
  // Only rewrite Drupal's known settings field. Script source is copied verbatim.
  return text.replace(/"baseUrl":"\\\/"/g, () => '"baseUrl":' + JSON.stringify(base));
}
let count = 0;
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await visit(file);
    else if (/\.(html|css)$/.test(entry.name)) {
      const original = await readFile(file, 'utf8');
      await writeFile(file, entry.name.endsWith('.html') ? rebaseHtml(original) : rebaseCss(original));
      count++;
    }
  }
}
await visit(output);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Prepared ${count} text assets and ${routes.size + 1} pages for ${base}`);
