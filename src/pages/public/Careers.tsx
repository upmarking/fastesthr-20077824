import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Rocket, Star, Heart, Zap, Globe, Coffee, Monitor, ChevronRight, Search } from 'lucide-react';

const Careers = () => {
  return (
    <PublicLayout title="Careers">
      <div className="relative z-10 space-y-32 py-10">
        
        {/* Pulse Hero */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden rounded-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent -z-10"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-orange-600/10 blur-[120px] rounded-[100%]"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl px-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md mb-8">
              <Rocket className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-mono text-orange-300 uppercase tracking-widest font-bold">Launch Window Open</span>
            </div>
            <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-tight">
              Fuel The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500">Momentum.</span>
            </h1>
            <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              We're looking for the outliers, the architects, and the dreamers who believe that mission-critical infrastructure should also be beautiful.
            </p>
          </motion.div>
        </section>

        {/* Culture & Perks */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { icon: Globe, title: 'Remote First', desc: 'Work from anywhere on the planet. High-bandwidth autonomy is our default state.' },
             { icon: Zap, title: 'Hyper Growth', desc: 'Accelerate your career in a field where we redefine the standard every 90 days.' },
             { icon: Heart, title: 'Holistic Health', desc: 'Zero-deductible health plans, mental health credits, and forced unplugging.' },
             { icon: Coffee, title: 'Deep Work', desc: 'No-meeting Wednesdays and a culture that respects your focus state.' },
             { icon: Monitor, title: 'Apex Gear', desc: 'We provide the ultimate workstation setup. Whatever you need to perform.' },
             { icon: Star, title: 'Equity Pulse', desc: 'Generous equity packages. We win together as a single node.' },
           ].map((perk, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="p-10 rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-orange-500/30 transition-all group"
             >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-8">
                   <perk.icon className="w-6 h-6" />
                </div>
                <h3 className="font-syne text-2xl font-bold text-white mb-4">{perk.title}</h3>
                <p className="font-outfit text-zinc-500 leading-relaxed text-sm">{perk.desc}</p>
             </motion.div>
           ))}
        </section>

        {/* Job Board Mockup */}
        <section className="space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4">
                 <h2 className="font-syne text-4xl font-bold text-white">Current Missions</h2>
                 <p className="font-outfit text-zinc-500 font-light">Join one of our active engineering or product squads.</p>
              </div>
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                 <input 
                   type="text" 
                   placeholder="Search roles..." 
                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                 />
              </div>
           </div>

           <div className="space-y-4">
              {[
                { title: 'Senior Protocol Engineer', team: 'Core Matrix', type: 'Full-time', location: 'Remote (UTC+/-4)' },
                { title: 'Frontend Architect', team: 'Apex UX', type: 'Full-time', location: 'Remote (Global)' },
                { title: 'Product Strategist', team: 'Strategy Node', type: 'Full-time', location: 'Remote (EU/US)' },
                { title: 'Security Researcher', team: 'Defense Grid', type: 'Contract', location: 'Remote (Global)' },
              ].map((job, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 10 }}
                  className="p-8 rounded-3xl bg-[#050505] border border-white/5 hover:bg-orange-500/5 hover:border-orange-500/20 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                   <div className="space-y-1">
                      <h3 className="text-xl font-syne font-bold text-white">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                         <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{job.team}</span>
                         <span>•</span>
                         <span>{job.type}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <span className="text-sm text-zinc-400 font-outfit">{job.location}</span>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-orange-400 group-hover:border-orange-400 transition-all">
                         <ChevronRight className="w-5 h-5" />
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default Careers;
