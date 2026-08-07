<?xml version="1.0" encoding="UTF-8"?>
<!--
  Browsers dropped native feed rendering years ago, so /rss.xml alone shows a
  wall of XML that reads as broken. This stylesheet is referenced from the feed
  and turns it into a readable page explaining what the file is and where to
  paste it. Feed readers ignore the instruction entirely, so the machine-facing
  contract is unchanged.

  XSLT 1.0 — the only version browsers implement.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <title><xsl:value-of select="/rss/channel/title"/> — feed</title>
        <style>
          :root {
            --bg: #f5f6f8; --card: #fff; --fg: #14141a; --muted: #6b6b76;
            --border: #e2e3e8; --primary: #7c3aed;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0c0c10; --card: #131318; --fg: #f2f3f7; --muted: #83858f;
              --border: #212127; --primary: #a855f7;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0; padding: 3rem 1.5rem 5rem; background: var(--bg); color: var(--fg);
            font-family: Inter, system-ui, -apple-system, sans-serif; line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 44rem; margin: 0 auto; }
          .eyebrow {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: .75rem; letter-spacing: .18em; text-transform: uppercase;
            color: var(--muted); margin: 0 0 .75rem;
          }
          .eyebrow span { color: var(--primary); }
          h1 { font-size: clamp(1.9rem, 5vw, 2.75rem); letter-spacing: -.03em; margin: 0 0 1rem; line-height: 1.1; }
          .lede { color: var(--muted); margin: 0 0 2rem; }
          .callout {
            background: var(--card); border: 1px solid var(--border); border-radius: 1rem;
            padding: 1.5rem; margin-bottom: 3rem;
          }
          .callout h2 { font-size: 1rem; margin: 0 0 .5rem; }
          .callout p { color: var(--muted); font-size: .9rem; margin: 0 0 1rem; }
          .url {
            display: block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: .85rem; background: var(--bg); border: 1px solid var(--border);
            border-radius: .5rem; padding: .75rem 1rem; color: var(--fg);
            word-break: break-all; user-select: all;
          }
          .items { border-top: 1px solid var(--border); }
          .item { border-bottom: 1px solid var(--border); padding: 1.5rem 0; }
          .item h3 { margin: 0 0 .4rem; font-size: 1.15rem; letter-spacing: -.01em; }
          .item h3 a { color: var(--fg); text-decoration: none; }
          .item h3 a:hover { color: var(--primary); }
          .date {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: .75rem; color: var(--muted); margin: 0 0 .5rem;
          }
          .desc { color: var(--muted); font-size: .9rem; margin: 0; }
          .back { display: inline-block; margin-top: 2.5rem; color: var(--primary); text-decoration: none; font-size: .9rem; }
          .back:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="eyebrow"><span>//</span> rss feed</p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="lede"><xsl:value-of select="/rss/channel/description"/></p>

          <div class="callout">
            <h2>This page is a feed, not an article.</h2>
            <p>
              Copy the address below into a feed reader — NetNewsWire, Feedly, Reeder,
              Inoreader — and new notes will arrive there automatically, with no account
              and no email address.
            </p>
            <code class="url">
              <xsl:value-of select="/rss/channel/atom:link/@href"/>
            </code>
          </div>

          <div class="items">
            <xsl:for-each select="/rss/channel/item">
              <div class="item">
                <p class="date"><xsl:value-of select="pubDate"/></p>
                <h3>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h3>
                <p class="desc"><xsl:value-of select="description"/></p>
              </div>
            </xsl:for-each>
          </div>

          <a class="back">
            <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
            ← Back to the notes
          </a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
