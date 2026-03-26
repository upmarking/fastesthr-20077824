import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Calendar, Tag, ChevronRight, Zap, History, Sparkles, Code } from 'lucide-react';

const ChangelogData = [
  {
    version: 'v2.4.0',
    date: 'March 24, 2026',
    title: 'Quantum Sync & Neural Graph v2',
    description: 'A major overhaul of our core data synchronization protocol. Introducing sub-millisecond graph resolution.',
    tags: ['Core', 'Performance'],
    changes: [
      'Implemented Quantum Sync for real-time state hydration.',
      'Neural Graph v2: Added support for 10x more complex org topologies.',
      'Reduced initial dashboard load time by 42%.',
    ]
  },
  {
    version: 'v2.3.5',
    date: 'March 10, 2026',
    title: 'Emerald Flux Payroll Engine',
    description: 'Expanding our liquidity protocol to 12 new jurisdictions across Southeast Asia.',
    tags: ['Payroll', 'Global'],
    changes: [
      'Added support for SGD, MYR, and THB local bank transfers.',
      'Automated tax compliance module for Singapore (CPF Integration).',
      'New liquid flow visualizations in the Admin Portal.',
    ]
  },
  {
    version: 'v2.3.0',
    date: 'February 22, 2026',
    title: 'Prism Talent ATS Refresh',
    description: 'A complete redesign of the Talent Pipeline interface with new AI parsing capabilities.',
    tags: ['ATS', 'UI/UX'],
    changes: [
      'New "Prism Vision" candidate profile layouts.',
      'Batch resume parsing engine (Neural DNA Parsing).',
      'Enhanced interview scheduling with multi-timezone orchestration.',
    ]
  }
];

const Changelog = () => {
  return (
    <PublicLayout title="Changelog">
      <div className="relative z-10 space-y-32 py-10 max-w-5xl mx-auto">
        
        {/* Delta Hero */}
        <section className="relative text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-4"
          >
            <History className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest font-bold">Delta Stream Live</span>
          </motion.div>
          <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tighter text-white">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500">Pulse.</span>
          </h1>
          <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            A chronological stream of every mutation, refinement, and breakthrough in the FastestHR ecosystem.
          </p>
        </section>

        {/* Timeline Stream */}
        <section className="relative px-6">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/20 to-transparent hidden md:block"></div>

          <div className="space-y-24">
            {ChangelogData.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-12 group`}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-blue-500 z-10 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"></div>

                {/* Content Card */}
                <div className={`flex-1 w-full ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} space-y-4`}>
                   <div className={`flex items-center gap-3 mb-2 justify-start ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <span className="font-mono text-blue-400 font-bold">{item.version}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-sm text-zinc-500 font-outfit">{item.date}</span>
                   </div>
                   <h3 className="font-syne text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                   <p className="font-outfit text-zinc-500 leading-relaxed max-w-md mx-auto md:mx-0 ${i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}">
                      {item.description}
                   </p>
                   <div className={`flex flex-wrap gap-2 pt-2 justify-start ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-zinc-400">
                           {tag}
                        </span>
                      ))}
                   </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 w-full p-8 rounded-[2rem] bg-[#050505] border border-white/5 group-hover:border-blue-500/20 transition-all">
                   <ul className="space-y-4">
                      {item.changes.map((change, ci) => (
                        <li key={ci} className="flex gap-4 group/item">
                           <ChevronRight className="w-5 h-5 text-zinc-700 group-hover/item:text-blue-500 transition-colors flex-shrink-0" />
                           <span className="text-zinc-400 text-sm font-outfit leading-relaxed">{change}</span>
                        </li>
                      ))}
                   </ul>
                   <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                      <div className="flex items-center gap-2 text-zinc-600">
                         <Code className="w-3 h-3" />
                         DIFF_COMMIT_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                      </div>
                      <button className="text-blue-400 hover:text-white transition-colors flex items-center gap-1">
                         Full Build Notes <ChevronRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Subscribe Footer */}
        <section className="py-20 text-center">
           <div className="p-12 rounded-[3rem] bg-gradient-to-b from-indigo-500/5 to-transparent border border-white/5 space-y-8 max-w-3xl mx-auto overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              <Sparkles className="w-12 h-12 text-blue-500 mx-auto opacity-30 animate-pulse" />
              <h2 className="font-syne text-4xl font-bold text-white">Stay Synced.</h2>
              <p className="font-outfit text-zinc-500">Subscribe to our engineering newsletter for deep-tech updates and roadmap leaks.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
                 <input 
                   type="email" 
                   placeholder="Enter your email" 
                   className="flex-1 bg-black border border-white/10 rounded-full py-4 px-8 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                 />
                 <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-500 transition-all hover:scale-105 active:scale-95">
                    Sync Updates
                 </button>
              </div>
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default Changelog;
