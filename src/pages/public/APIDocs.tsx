import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Terminal, Code2, Cpu, Globe, Lock, Zap, ChevronRight, Copy } from 'lucide-react';

const APIDocs = () => {
  return (
    <PublicLayout title="API Documentation">
      <div className="relative z-10 space-y-32 py-10">
        
        {/* Terminal Hero */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.1)]">
            <div className="px-6 py-4 bg-[#111] border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></div>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">fastest-hr-cli — v2.4.0</div>
              <div className="w-12"></div>
            </div>
            <div className="p-10 space-y-6 font-mono text-sm sm:text-base">
               <div className="flex gap-4">
                 <span className="text-emerald-400">➜</span>
                 <motion.span 
                   initial={{ width: 0 }}
                   animate={{ width: '100%' }}
                   transition={{ duration: 1 }}
                   className="text-zinc-300 overflow-hidden whitespace-nowrap border-r-2 border-cyan-400 animate-cursor"
                 >
                   fastesthr init --protocol=quantum
                 </motion.span>
               </div>
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.2 }}
                 className="space-y-2 text-zinc-500"
               >
                 <div className="text-cyan-400">Initializing Workforce Protocol...</div>
                 <div>[OK] Handshaking with Neural Core</div>
                 <div>[OK] Mounting Graph Topology</div>
                 <div className="text-white pt-4 font-bold">API Access Granted. Welcome to the Matrix.</div>
               </motion.div>
            </div>
          </div>
          
          <div className="mt-16 text-center space-y-6 max-w-2xl px-4">
            <h1 className="font-syne text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
              Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">First.</span>
            </h1>
            <p className="font-outfit text-xl text-zinc-400 font-light leading-relaxed">
              Native SDKs, GraphQL endpoints, and real-time webhooks. Integrate the world's fastest workforce engine into your own stack in minutes.
            </p>
          </div>
        </section>

        {/* API Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: Code2, title: 'Multi-SDK Support', desc: 'Native libraries for Go, Rust, TS, and Python. Perfectly typed and highly optimized.' },
             { icon: Globe, title: 'GraphQL Gateway', desc: 'Query exactly what you need. Zero over-fetching. Sub-millisecond resolution.' },
             { icon: Zap, title: 'Real-time Hooks', desc: 'Every state change produces an event. Sync your entire stack with zero latency.' },
           ].map((feat, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="p-10 rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-cyan-500/30 transition-all group"
             >
                <feat.icon className="w-10 h-10 text-cyan-400 mb-8" />
                <h3 className="font-syne text-2xl font-bold text-white mb-4">{feat.title}</h3>
                <p className="font-outfit text-zinc-500 leading-relaxed text-sm">{feat.desc}</p>
             </motion.div>
           ))}
        </section>

        {/* Interactive Endpoint Explorer Mock */}
        <section className="space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4">
                 <h2 className="font-syne text-4xl font-bold text-white">Core Endpoints</h2>
                 <p className="font-outfit text-zinc-500 font-light">Explore the primitive operations of the workforce engine.</p>
              </div>
              <div className="flex gap-2">
                 {['REST', 'GraphQL', 'Webhooks'].map(t => (
                   <button key={t} className={`px-6 py-2 rounded-full text-xs font-mono font-bold border transition-all ${t === 'REST' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'}`}>
                     {t}
                   </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Endpoint List */}
              <div className="md:col-span-4 space-y-4">
                 {[
                   { method: 'GET', path: '/v2/employees', active: true },
                   { method: 'POST', path: '/v2/payroll/init', active: false },
                   { method: 'GET', path: '/v2/graph/org', active: false },
                   { method: 'PATCH', path: '/v2/documents/:id', active: false },
                 ].map((ep, i) => (
                   <div key={i} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${ep.active ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-[#050505] border-white/5 hover:border-white/10'}`}>
                      <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{ep.method}</span>
                         <span className={`text-sm font-mono ${ep.active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{ep.path}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-all ${ep.active ? 'text-cyan-400 translate-x-0' : 'text-zinc-700 opacity-0 group-hover:opacity-100 -translate-x-2'}`} />
                   </div>
                 ))}
              </div>

              {/* Code Viewer */}
              <div className="md:col-span-8 rounded-3xl bg-[#0a0a0a] border border-white/5 overflow-hidden flex flex-col">
                 <div className="px-6 py-3 bg-[#111] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-mono text-zinc-400">Response Scheme</span>
                       <span className="text-[10px] font-mono text-emerald-400 font-bold">200 OK</span>
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                 </div>
                 <div className="p-8 font-mono text-xs sm:text-sm leading-relaxed text-zinc-400 overflow-x-auto">
                    <pre>
                      <code>
                        <span className="text-pink-400">{"{"}</span><br />
                        {"  "}<span className="text-cyan-400">"status"</span>: <span className="text-amber-400">"success"</span>,<br />
                        {"  "}<span className="text-cyan-400">"latency"</span>: <span className="text-amber-400">"0.42ms"</span>,<br />
                        {"  "}<span className="text-cyan-400">"data"</span>: <span className="text-pink-400">{"{"}</span><br />
                        {"    "}<span className="text-cyan-400">"id"</span>: <span className="text-amber-400">"HR_9921_X"</span>,<br />
                        {"    "}<span className="text-cyan-400">"nodes"</span>: [<br />
                        {"      "}<span className="text-pink-400">{"{"}</span> <span className="text-cyan-400">"type"</span>: <span className="text-amber-400">"staff"</span>, <span className="text-cyan-400">"count"</span>: <span className="text-violet-400">429</span> <span className="text-pink-400">{"}"}</span>,<br />
                        {"      "}<span className="text-pink-400">{"{"}</span> <span className="text-cyan-400">"type"</span>: <span className="text-amber-400">"admin"</span>, <span className="text-cyan-400">"count"</span>: <span className="text-violet-400">12</span> <span className="text-pink-400">{"}"}</span><br />
                        {"    "}]<br />
                        {"  "}<span className="text-pink-400">{"}"}</span><br />
                        <span className="text-pink-400">{"}"}</span>
                      </code>
                    </pre>
                 </div>
              </div>
           </div>
        </section>

      </div>

      <style>{`
        @keyframes cursor {
          from, to { border-color: transparent }
          50% { border-color: #22d3ee }
        }
        .animate-cursor {
          animation: cursor 0.8s step-end infinite;
        }
      `}</style>
    </PublicLayout>
  );
};

export default APIDocs;
