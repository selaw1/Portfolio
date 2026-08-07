import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './sections/Navigation';
import Footer from './sections/Footer';
import Home from './pages/Home';
import NotesIndex from './pages/NotesIndex';
import NPlusOne from './pages/notes/NPlusOne';
import Harakti from './pages/work/Harakti';
import NotFound from './pages/NotFound';
import { metaForPath } from './lib/meta';

/**
 * The prerenderer writes the correct <head> into every emitted page, so this
 * only has to cover client-side navigation between routes.
 */
function useRouteMeta() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    document.title = meta.title;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', meta.url);

    // Anchors on the homepage own their own scroll position.
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
}

function Layout() {
  useRouteMeta();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<NotesIndex />} />
          <Route path="/notes/n-plus-one" element={<NPlusOne />} />
          <Route path="/work/harakti" element={<Harakti />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      {/* domAnimation covers animations, gestures and whileInView. It leaves
          out the layout-projection engine, which nothing here uses. */}
      <LazyMotion features={domAnimation} strict>
        {/* Motion drops transform animations for users who ask for reduced
            motion, while still settling elements on their final opacity —
            so nothing is left invisible. */}
        <MotionConfig reducedMotion="user">
          <Layout />
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
