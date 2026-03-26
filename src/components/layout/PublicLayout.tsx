import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
}

export function PublicLayout({ children, title }: PublicLayoutProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | FastestHR`;
    }
  }, [title]);

  return (
    <div className="min-h-screen bg-black text-zinc-50 overflow-hidden selection:bg-cyan-500/30 flex flex-col font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@100;200;300;400;500;600;700&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          pointer-events: none;
        }
      `}</style>

      {/* Global Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain"></div>
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[120px] bg-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_100%,transparent_100%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">FastestHR</span>
          </Link>
          <div className="flex items-center gap-6 z-10">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="relative group overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-medium transition-all hover:scale-105 duration-300">
              <span className="relative z-10 text-black">Get Started</span>
              <div className="absolute inset-0 h-full w-full scale-[2] blur-xl bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}
