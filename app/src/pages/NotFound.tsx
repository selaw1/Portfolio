import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-32">
        <p className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
          <span className="text-primary">//</span> 404
        </p>
        <h1
          className="font-display font-bold text-foreground mb-5"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', letterSpacing: '-0.03em' }}
        >
          Nothing here
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
          That page doesn't exist — or it moved and I forgot to leave a redirect.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-ring rounded"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back home
        </Link>
      </div>
    </div>
  );
}
