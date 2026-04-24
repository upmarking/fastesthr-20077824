import { motion, useScroll, useTransform } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Users, Filter, Rocket, Star, Sparkles, Search, UserCheck, Target } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';

const TalentPipeline = () => {
  const { scrollYProgress } = useScroll();
  const rotatePrism = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <PublicLayout title="Talent Pipeline">
      <SEO 
        title="AI-Driven Talent Pipeline & ATS | Intelligent Sourcing | FastestHR"
        description="Identify elite talent with neural sourcing and automated vetting. Transform your recruitment into a high-velocity talent acquisition machine."
        keywords="AI recruitment platform, intelligent ATS, talent pipeline automation, neural sourcing software"
        type="software"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Platform', path: '/' },
          { name: 'Talent Pipeline', path: '/platform/talent-pipeline' }
        ]}
      />
      <div className="relative z-10 space-y-32 py-10">
        
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center">
          <motion.div 
            style={{ rotate: rotatePrism }}
            className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-pink-500/20 blur-[100px] -z-10"
          ></motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl px-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-md mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-mono text-violet-300 uppercase tracking-widest font-bold">Prism Optics Engaged</span>
            </div>
            <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-none">
              Refracting <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">Potential.</span>
            </h1>
            <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Identify elite talent through a spectrum of data. Our ATS isn't just a list—it's a multi-dimensional vision of your future workforce.
            </p>
          </motion.div>

          {/* Staggered Profile Mockups */}
          <div className="mt-20 relative w-full max-w-5xl h-64 hidden md:block">
             {[
               { name: 'Sarah Chen', role: 'Staff Engineer', color: 'from-violet-500', x: -300, y: 0, delay: 0.2 },
               { name: 'Marcus Bell', role: 'Product Lead', color: 'from-pink-500', x: 0, y: -40, delay: 0.4 },
               { name: 'Elena Rossi', role: 'Design Director', color: 'from-amber-500', x: 300, y: 20, delay: 0.6 },
             ].map((card, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, x: card.x, y: card.y + 50 }}
                 animate={{ opacity: 1, y: card.y }}
                 transition={{ duration: 1, delay: card.delay, ease: "easeOut" }}
                 className="absolute left-1/2 -translate-x-1/2 group"
                 style={{ marginLeft: card.x }}
               >
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl w-64 text-left hover:border-white/20 transition-all cursor-pointer">
                   <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} to-black mb-4 flex items-center justify-center text-white font-bold`}>
                     {card.name[0]}
                   </div>
                   <h4 className="text-white font-bold">{card.name}</h4>
                   <p className="text-xs text-zinc-500">{card.role}</p>
                   <div className="mt-4 flex gap-1">
                      {[1,2,3].map(s => <Star key={s} className="w-3 h-3 text-violet-400 fill-violet-400" />)}
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </section>

        {/* Prism Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           {[
             { icon: Search, title: 'Neural Sourcing', desc: 'Find passive talent across the web with automated scanning.' },
             { icon: Filter, title: 'Smart Refraction', desc: 'Filter candidates by deeper traits, not just keywords.' },
             { icon: UserCheck, title: 'Auto-Vetting', desc: 'Technical assessments triggered by pipeline entry.' },
             { icon: Target, title: 'Hit Rate Optimization', desc: 'Predictive analytics on offer acceptance probability.' },
           ].map((feat, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -10 }}
               className="p-8 rounded-[2rem] bg-[#050505] border border-white/5 hover:border-violet-500/30 transition-all group"
             >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-syne text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="font-outfit text-sm text-zinc-500 leading-relaxed">{feat.desc}</p>
             </motion.div>
           ))}

        </section>

        {/* Scanning Animation Section */}
        <section className="relative py-20 rounded-[3rem] bg-gradient-to-tr from-violet-900/10 via-black to-pink-900/10 border border-white/5 overflow-hidden">
           <div className="max-w-4xl mx-auto px-10 flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                 <h2 className="font-syne text-4xl md:text-5xl font-bold text-white leading-tight">Instant <br /> DNA Parsing.</h2>
                 <p className="font-outfit text-zinc-400 text-lg leading-relaxed">
                   Upload a batch of resumes and watch our system extract skills, experience, and intent in milliseconds. We deconstruct the "DNA" of every candidate to match them with your specific engineering culture.
                 </p>
                 <button className="flex items-center gap-2 text-violet-400 font-bold hover:gap-4 transition-all">
                    Explore Resume Engine <Rocket className="w-4 h-4" />
                 </button>
              </div>
              <div className="flex-1 relative w-full h-80 rounded-3xl bg-black/40 border border-white/5 p-6 overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan"></div>
                 <div className="space-y-4 pt-10 font-mono text-[10px] text-zinc-500">
                    <div className="flex items-center gap-2 text-violet-400"><Sparkles className="w-3 h-3" /> ANALYZING_EXPERIENCE_CLUSTERS...</div>
                    <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                    <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                    <div className="flex items-center gap-2 text-pink-400 font-bold">MATCH_FOUND: [Staff Engineer]</div>
                    <div className="h-2 w-full bg-white/5 rounded overflow-hidden relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: '85%' }}
                         className="absolute top-0 left-0 h-full bg-violet-500"
                       />
                    </div>
                    <div className="h-2 w-5/6 bg-white/5 rounded"></div>
                    <div className="h-2 w-2/3 bg-white/5 rounded"></div>
                 </div>
              </div>
           </div>
        </section>

      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </PublicLayout>
  );
};

export default TalentPipeline;
