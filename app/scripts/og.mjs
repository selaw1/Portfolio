/**
 * Generates a 1200x630 Open Graph image per route.
 *
 * Runs before prerender, which reads the manifest this writes and injects the
 * og:image / twitter:image tags. Fonts come from @fontsource (woff — satori
 * does not read woff2), so this needs no network and no headless browser.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const outDir = join(distDir, 'og');

const { ROUTES, metaForPath } = await import(join(root, 'dist-ssr', 'entry-server.js'));
const { NOTES, WORK, notePath, workPath } = await import(join(root, 'dist-ssr', 'entry-server.js'));

const font = (p) => readFile(join(root, 'node_modules', p));
const [displayBold, bodyRegular, bodyMedium] = await Promise.all([
  font('@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'),
  font('@fontsource/inter/files/inter-latin-400-normal.woff'),
  font('@fontsource/inter/files/inter-latin-500-normal.woff'),
]);

const FONTS = [
  { name: 'Space Grotesk', data: displayBold, weight: 700, style: 'normal' },
  { name: 'Inter', data: bodyRegular, weight: 400, style: 'normal' },
  { name: 'Inter', data: bodyMedium, weight: 500, style: 'normal' },
];

// Matches the site's dark theme tokens.
const BG = '#0c0c10';
const FG = '#f2f3f7';
const MUTED = '#83858f';
const PRIMARY = '#a855f7';
const BORDER = '#212127';

/** Per-route cover: an eyebrow, the headline, and a short support line. */
function cover(route) {
  const meta = metaForPath(route);

  const note = NOTES.find((n) => notePath(n.slug) === route);
  if (note) return { eyebrow: '// note', title: note.title, support: note.blurb };

  const work = WORK.find((w) => workPath(w.slug) === route);
  if (work) return { eyebrow: '// case study', title: work.title, support: work.tagline };

  if (route === '/notes') {
    return {
      eyebrow: '// notes',
      title: 'Notes',
      support: 'Short technical notes, each built around a demo you can drive.',
    };
  }
  return {
    eyebrow: '// software engineer',
    title: 'Yousef Selawi',
    support: meta.description.split('.')[0] + '.',
  };
}

function template({ eyebrow, title, support }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', backgroundColor: BG, padding: '72px',
        // A soft primary wash in the corner, echoing the hero glow.
        backgroundImage: `radial-gradient(circle at 88% 8%, rgba(168,85,247,0.22) 0%, rgba(12,12,16,0) 55%)`,
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '16px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '52px', height: '52px', borderRadius: '12px',
                    border: `1px solid rgba(168,85,247,0.35)`,
                    backgroundColor: 'rgba(168,85,247,0.12)',
                    color: PRIMARY, fontSize: '22px', fontFamily: 'Space Grotesk', fontWeight: 700,
                  },
                  children: 'YS',
                },
              },
              {
                type: 'div',
                props: {
                  style: { color: MUTED, fontSize: '22px', fontFamily: 'Inter', fontWeight: 500 },
                  children: eyebrow,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '24px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    color: FG, fontSize: title.length > 28 ? '68px' : '86px',
                    fontFamily: 'Space Grotesk', fontWeight: 700,
                    letterSpacing: '-0.03em', lineHeight: 1.05,
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    color: MUTED, fontSize: '28px', fontFamily: 'Inter', fontWeight: 400,
                    lineHeight: 1.45, maxWidth: '900px',
                  },
                  children: support,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: `1px solid ${BORDER}`, paddingTop: '28px',
              color: MUTED, fontSize: '22px', fontFamily: 'Inter', fontWeight: 500,
            },
            children: [
              { type: 'div', props: { children: 'yousef.selawii.com' } },
              { type: 'div', props: { style: { color: PRIMARY }, children: 'Dubai, UAE' } },
            ],
          },
        },
      ],
    },
  };
}

/** '/' -> og/home.png, '/notes/n-plus-one' -> og/notes-n-plus-one.png */
const fileFor = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));

await mkdir(outDir, { recursive: true });
const manifest = {};

for (const route of ROUTES) {
  const svg = await satori(template(cover(route)), { width: 1200, height: 630, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  const name = `${fileFor(route)}.png`;
  await writeFile(join(outDir, name), png);
  manifest[route] = `/og/${name}`;
  console.log(`  og ${route.padEnd(22)} → dist/og/${name} (${(png.length / 1024).toFixed(0)} kB)`);
}

await writeFile(join(distDir, 'og', 'manifest.json'), JSON.stringify(manifest, null, 2));
