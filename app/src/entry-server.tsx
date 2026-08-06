import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import './index.css';

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

export { ROUTES, metaForPath } from './lib/meta';
export { NOTES, WORK, SITE_URL, notePath, workPath } from './notes/registry';
