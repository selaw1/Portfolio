/**
 * Renders every route in the app to a real HTML file so that crawlers, link
 * unfurlers, and JS-less clients get complete markup instead of an empty div.
 *
 * Runs after both Vite builds:
 *   dist/      client bundle + index.html template (with the two placeholders)
 *   dist-ssr/  server bundle exposing render() and the route table
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const { render, ROUTES, metaForPath, SITE_URL, NOTES, notePath } = await import(
  join(distDir, '..', 'dist-ssr', 'entry-server.js')
);

const template = await readFile(join(distDir, 'index.html'), 'utf-8');

// Written by scripts/og.mjs, which runs first. Absent only if that step was skipped.
const ogManifest = JSON.parse(
  await readFile(join(distDir, 'og', 'manifest.json'), 'utf-8').catch(() => '{}')
);

if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('dist/index.html is missing the <!--app-html--> / <!--app-head--> placeholders');
}

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headFor(meta, ogImage) {
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${escape(meta.url)}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="Yousef Selawi" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${escape(meta.url)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
  ];

  if (ogImage) {
    const abs = `${SITE_URL}${ogImage}`;
    tags.push(`<meta property="og:image" content="${escape(abs)}" />`);
    tags.push(`<meta property="og:image:width" content="1200" />`);
    tags.push(`<meta property="og:image:height" content="630" />`);
    tags.push(`<meta property="og:image:alt" content="${escape(meta.title)}" />`);
    tags.push(`<meta name="twitter:image" content="${escape(abs)}" />`);
  }

  if (meta.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${meta.publishedTime}" />`);
    tags.push(
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: meta.title,
        description: meta.description,
        datePublished: meta.publishedTime,
        url: meta.url,
        author: { '@type': 'Person', name: 'Yousef Selawi', url: SITE_URL },
      })}</script>`
    );
  } else if (meta.url === SITE_URL) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Yousef Selawi',
        jobTitle: 'Software Engineer',
        url: SITE_URL,
        email: 'mailto:yousef@selawii.com',
        address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
        sameAs: [
          'https://github.com/selaw1',
          'https://www.linkedin.com/in/yousef-selawi/',
        ],
      })}</script>`
    );
  }

  return tags.join('\n    ');
}

/** '/' -> dist/index.html, '/notes/x' -> dist/notes/x/index.html */
function outputPath(route) {
  return route === '/'
    ? join(distDir, 'index.html')
    : join(distDir, route.replace(/^\//, ''), 'index.html');
}

async function emit(route, html) {
  const file = outputPath(route);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf-8');
  return file;
}

for (const route of ROUTES) {
  const meta = metaForPath(route);
  const html = template
    .replace('<!--app-head-->', headFor(meta, ogManifest[route]))
    .replace('<!--app-html-->', render(route));

  await emit(route, html);
  console.log(`  prerendered ${route.padEnd(22)} → ${outputPath(route).replace(distDir, 'dist')}`);
}

// Cloudflare Pages serves this for any path that isn't a built file.
const notFound = template
  .replace('<!--app-head-->', headFor({ ...metaForPath('/'), title: 'Not found — Yousef Selawi' }, ogManifest['/']))
  .replace('<!--app-html-->', render('/__404__'));
await writeFile(join(distDir, '404.html'), notFound, 'utf-8');
console.log('  prerendered 404             → dist/404.html');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => {
  const meta = metaForPath(r);
  const lastmod = meta.publishedTime ? `\n    <lastmod>${meta.publishedTime}</lastmod>` : '';
  return `  <url>\n    <loc>${meta.url}</loc>${lastmod}\n  </url>`;
}).join('\n')}
</urlset>
`;
await writeFile(join(distDir, 'sitemap.xml'), sitemap, 'utf-8');

await writeFile(
  join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  'utf-8'
);

/**
 * RSS 2.0 for the notes. Readers and aggregators poll this instead of the
 * page, so a new note reaches subscribers without them checking back.
 * Built from the same registry that drives the routes and the sitemap.
 */
const rfc822 = (iso) =>
  new Date(`${iso}T00:00:00Z`).toUTCString();

const byNewest = [...NOTES].sort((a, b) => b.date.localeCompare(a.date));

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yousef Selawi — Notes</title>
    <link>${SITE_URL}/notes</link>
    <description>Short technical notes on Django, PostgreSQL and TimescaleDB, each built around a demo you can drive.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${byNewest.length ? `    <lastBuildDate>${rfc822(byNewest[0].date)}</lastBuildDate>` : ''}
${byNewest
  .map((n) => {
    const url = `${SITE_URL}${notePath(n.slug)}`;
    return `    <item>
      <title>${escape(n.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(n.date)}</pubDate>
      <description>${escape(n.description)}</description>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>
`;
await writeFile(join(distDir, 'rss.xml'), rss, 'utf-8');
console.log(`  wrote rss.xml (${byNewest.length} items)`);

console.log(`  wrote sitemap.xml (${ROUTES.length} urls) and robots.txt`);
