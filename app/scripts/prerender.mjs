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

const { render, ROUTES, metaForPath, SITE_URL } = await import(
  join(distDir, '..', 'dist-ssr', 'entry-server.js')
);

const template = await readFile(join(distDir, 'index.html'), 'utf-8');

if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('dist/index.html is missing the <!--app-html--> / <!--app-head--> placeholders');
}

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headFor(meta) {
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
    .replace('<!--app-head-->', headFor(meta))
    .replace('<!--app-html-->', render(route));

  await emit(route, html);
  console.log(`  prerendered ${route.padEnd(22)} → ${outputPath(route).replace(distDir, 'dist')}`);
}

// Cloudflare Pages serves this for any path that isn't a built file.
const notFound = template
  .replace('<!--app-head-->', headFor({ ...metaForPath('/'), title: 'Not found — Yousef Selawi' }))
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

console.log(`  wrote sitemap.xml (${ROUTES.length} urls) and robots.txt`);
