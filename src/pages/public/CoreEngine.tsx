import { motion, useScroll, useTransform } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Cpu, Zap, Database, Shield, Radio, Activity, ChevronRight, Layers } from 'lucide-react';

const CoreEngine = () => {
  const { scrollYProgress } = useScroll();
  const rotateCore = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scaleCore = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  return (
    <PublicLayout title="Core Engine">
      <div className="relative z-10 space-y-32 py-10">
        
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 -z-10"
          >
            <motion.div 
              style={{ rotate: rotateCore, scale: scaleCore }}
              className="w-full h-full rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-3xl relative"
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2)_0,transparent_70%)] animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border border-dashed border-indigo-500/30 animate-spin-slow"></div>
              <div className="absolute inset-12 rounded-full border border-cyan-400/40"></div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-[0.2em] font-bold">Neural Core Active</span>
            </div>
            <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-none">
              The Matrix <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500">Infrastructure.</span>
            </h1>
            <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Not just a database. A living, breathing graph of your entire workforce. Built for sub-millisecond resolution at planetary scale.
            </p>
            <div className="pt-8 flex justify-center gap-6">
              <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  Initialize Sync <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid - Asymmetric & Modular */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
          
          {/* Card 1: Large Feature */}
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            viewport={{ once: true }}
            className="md:col-span-7 group relative p-10 rounded-[2.5rem] bg-[#050505] border border-white/5 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-64 h-64 text-cyan-500" />
            </div>
            <div className="relative z-10 space-y-6 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-syne text-3xl font-bold text-white">Hyper-Graph Topology</h3>
              <p className="font-outfit text-zinc-500 leading-relaxed text-lg">
                Our core engine uses a proprietary non-relational graph architecture that understands complex organizational relationships instantly. No more JOIN-heavy queries.
              </p>
              <ul className="space-y-3 pt-4">
                {['Dynamic Org Rendering', 'Permission Inheritance', 'Relationship Mapping'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-mono text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Small Feature */}
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            className="md:col-span-5 group p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/20 to-black border border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grain opacity-10"></div>
            <div className="relative z-10">
              <Zap className="w-10 h-10 text-indigo-400 mb-8" />
              <h3 className="font-syne text-3xl font-bold text-white mb-4">0.4ms Latency</h3>
              <p className="font-outfit text-zinc-500 leading-relaxed">
                Hardware-accelerated data retrieval. We've optimized every syscall to ensure your dashboard loads before you even think about it.
              </p>
              <div className="mt-12 h-20 w-full bg-black/40 rounded-2xl border border-white/5 p-4 flex items-end gap-1">
                {[40, 70, 45, 90, 65, 100, 80, 55, 95, 75].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 bg-indigo-500/40 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Horizontal Feature */}
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            className="md:col-span-12 group p-12 rounded-[2.5rem] bg-[#080808] border border-white/5 flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-syne text-3xl font-bold text-white">Immutable Audit Logs</h3>
              </div>
              <p className="font-outfit text-zinc-500 text-lg leading-relaxed">
                Every packet, every mutation, every read. Everything is cryptographically signed and stored in a multi-region immutable ledger. Security is baked into the pulse.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center">
                 <Radio className="w-12 h-12 text-zinc-600 animate-pulse" />
              </div>
              <div className="aspect-square rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center">
                 <Activity className="w-12 h-12 text-cyan-400/50" />
              </div>
            </div>
          </motion.div>

        </section>

        {/* Tech Stack Visualization */}
        <section className="py-20 text-center space-y-12">
          <h2 className="font-syne text-4xl font-bold text-white">Built on the Edge</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
             {['Rust', 'WebAssembly', 'NATS', 'GraphQL', 'Vector DB'].map((tech) => (
               <span key={tech} className="font-mono text-xl tracking-widest text-zinc-300 hover:text-white transition-colors cursor-default">{tech}</span>
             ))}
          </div>
        </section>

      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </PublicLayout>
  );
};

export default CoreEngine;
