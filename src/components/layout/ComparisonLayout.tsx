import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/seo/SEO';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Zap } from 'lucide-react';

interface FeatureRow {
  name: string;
  fastestHR: boolean | string;
  competitor: boolean | string;
  desc?: string;
}

interface ComparisonLayoutProps {
  competitorName: string;
  heroTitle: string;
  heroDesc: string;
  features: FeatureRow[];
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
}

export const ComparisonLayout: React.FC<ComparisonLayoutProps> = ({
  competitorName,
  heroTitle,
  heroDesc,
  features,
  seoTitle,
  seoDesc,
  seoKeywords
}) => {
  return (
    <div className="min-h-screen bg-black text-zinc-50 overflow-hidden font-sans">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        type="website"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Compare', path: '/compare' },
          { name: competitorName, path: window.location.pathname }
        ]}
      />

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400">FastestHR</span>
          </Link>
          <Link to="/register" className="relative group overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-medium transition-all hover:scale-105 duration-300">
            <span className="relative z-10 text-black">Get Started</span>
          </Link>
        </div>
      </nav>

      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-8 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              {heroDesc}
            </p>
          </motion.div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#050505] shadow-2xl mb-32">
            <div className="grid grid-cols-3 border-b border-white/5 bg-zinc-900/50">
              <div className="p-8 text-sm font-mono text-zinc-500 uppercase tracking-widest">Capabilities</div>
              <div className="p-8 text-center border-x border-white/5">
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-lg mb-1">
                  <Zap className="w-4 h-4" /> FastestHR
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Velocity Core</div>
              </div>
              <div className="p-8 text-center text-zinc-400 font-bold text-lg grayscale opacity-60">
                {competitorName}
              </div>
            </div>

            {features.map((feature, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                <div className="p-8">
                  <div className="text-zinc-100 font-bold mb-1">{feature.name}</div>
                  {feature.desc && <div className="text-xs text-zinc-500 font-light">{feature.desc}</div>}
                </div>
                <div className="p-8 flex items-center justify-center border-x border-white/5 bg-cyan-500/[0.02]">
                  {typeof feature.fastestHR === 'boolean' ? (
                    feature.fastestHR ? <Check className="w-6 h-6 text-cyan-400" /> : <X className="w-6 h-6 text-zinc-700" />
                  ) : <span className="font-bold text-white">{feature.fastestHR}</span>}
                </div>
                <div className="p-8 flex items-center justify-center grayscale opacity-40">
                  {typeof feature.competitor === 'boolean' ? (
                    feature.competitor ? <Check className="w-5 h-5 text-zinc-400" /> : <X className="w-5 h-5 text-zinc-700" />
                  ) : <span className="text-zinc-500">{feature.competitor}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-b from-transparent to-cyan-500/5 py-24 rounded-3xl border border-white/5">
            <h2 className="text-4xl font-extrabold tracking-tighter mb-8 leading-tight">Ready to switch to <br /><span className="text-cyan-400">High-Performance HR?</span></h2>
            <Link to="/register" className="inline-flex h-16 items-center justify-center rounded-full bg-white px-12 font-bold text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Initialize Deployment <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
