import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Users, Globe, Eye, Heart, Target, Sparkles, ChevronRight } from 'lucide-react';

const About = () => {
  return (
    <PublicLayout title="About Us">
      <div className="relative z-10 space-y-32 py-10">
        
        {/* Nexus Hero */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
             <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 rotate: [0, 5, 0]
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"
             ></motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl px-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">Protocol Vision: 2030</span>
            </div>
            <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-tight">
              A Nexus For <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Human Capital.</span>
            </h1>
            <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              We aren't just building software. We're architecting the infrastructure for a global, borderless workforce where potential is the only currency.
            </p>
          </motion.div>
        </section>

        {/* Our Philosophy: Nexus Network */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-white leading-tight">Solving the <br /> Workforce Paradox.</h2>
              <p className="font-outfit text-zinc-500 text-lg leading-relaxed">
                As the world becomes more connected, managing a workforce has somehow become more complex. FastestHR exists to collapse that complexity into a single, elegant protocol.
              </p>
              <div className="space-y-6">
                 {[
                   { icon: Target, title: 'Precision Engineering', desc: 'Every feature is built with sub-millisecond intent.' },
                   { icon: Heart, title: 'Human Centricity', desc: 'Design that respects the person behind the data point.' },
                   { icon: Globe, title: 'Global Neutrality', desc: 'Infrastructure that transcends borders and bureaucracy.' },
                 ].map((p, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                         <p.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-white font-bold">{p.title}</h4>
                         <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 overflow-hidden p-12">
                 <div className="absolute inset-0 bg-grain opacity-10"></div>
                 <div className="relative h-full flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full border-2 border-dashed border-indigo-500/20 rounded-full flex items-center justify-center"
                    >
                       <div className="w-2/3 h-2/3 border border-pink-500/20 rounded-full flex items-center justify-center">
                          <div className="w-1/3 h-1/3 bg-white rounded-full blur-[40px] opacity-20 animate-pulse"></div>
                       </div>
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles className="w-16 h-16 text-white opacity-20" />
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-8 rounded-3xl bg-black border border-white/10 shadow-2xl backdrop-blur-2xl max-w-[200px]">
                 <div className="text-4xl font-syne font-extrabold text-white mb-1">150+</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Active Realms</div>
              </div>
           </div>
        </section>

        {/* Global Impact */}
        <section className="py-20 text-center space-y-12">
           <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-syne text-4xl font-bold text-white">Join the Protocol</h2>
              <p className="font-outfit text-zinc-500 text-lg">
                We are a distributed team of engineers, designers, and visionaries across 12 countries.
              </p>
           </div>
           <div className="pt-10">
              <button className="px-10 py-5 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto">
                 View Open Roles <ChevronRight className="w-5 h-5" />
              </button>
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default About;
