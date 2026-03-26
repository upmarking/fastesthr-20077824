import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Shield, Lock, Activity, Cpu, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

const Security = () => {
  const securityFeatures = [
    { icon: Lock, title: 'Zero Trust Architecture', desc: 'Every request is authenticated and authorized with dynamic identity nodes.' },
    { icon: Shield, title: 'DDoS Mitigation', desc: 'Built-in protection at the edge to ensure service availability during complex attacks.' },
    { icon: Activity, title: 'Real-time Intrusion Detection', desc: 'AI-driven monitoring that detects and throttles anomalous behavior instantly.' },
    { icon: Cpu, title: 'Hardware Security Modules', desc: 'Cryptographic keys are stored in dedicated hardware for maximum entropy and protection.' },
  ];

  return (
    <PublicLayout title="Security Protocol">
      <div className="relative z-10 space-y-32 py-10 max-w-5xl mx-auto">
        
        {/* Security Hero */}
        <section className="relative text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md mb-4"
          >
            <Shield className="w-4 h-4 text-rose-400" />
            <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest font-bold">Defense Grid: Optimal</span>
          </motion.div>
          <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tighter text-white">
            Unbreakable <span className="text-zinc-500">Defense.</span>
          </h1>
          <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Security isn't an afterthought. It's the core of the FastestHR protocol. We architect for the most hostile environments.
          </p>
        </section>

        {/* Security Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
           {securityFeatures.map((feat, i) => (
             <motion.div 
               key={i}
               whileInView={{ opacity: 1, y: 0 }}
               initial={{ opacity: 0, y: 30 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="group p-10 rounded-[3rem] bg-[#050505] border border-white/5 hover:border-rose-500/30 transition-all flex flex-col md:flex-row gap-8 items-start"
             >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-rose-400 group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-all flex-shrink-0">
                   <feat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                   <h3 className="font-syne text-2xl font-bold text-white">{feat.title}</h3>
                   <p className="font-outfit text-zinc-500 leading-relaxed text-sm">
                      {feat.desc}
                   </p>
                </div>
             </motion.div>
           ))}
        </section>

        {/* Bounty / Disclosure Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-rose-500/5 border border-rose-500/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12">
              <AlertTriangle className="w-64 h-64 text-white" />
           </div>
           <div className="md:col-span-7 space-y-8 relative z-10">
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-white leading-tight">Vulnerability <br /> Disclosure.</h2>
              <p className="font-outfit text-zinc-400 text-lg leading-relaxed">
                We believe in transparency and peer review. If you've identified a security loophole in the Matrix, we want to know. Our bounty program rewards ethical researchers for helping us stay impenetrable.
              </p>
              <div className="space-y-4">
                 {['PGP Encrypted Reporting', 'Bug Bounty Rewards', 'Fast-track Mitigation'].map(item => (
                   <div key={item} className="flex items-center gap-3 text-sm font-mono text-rose-300">
                      <CheckCircle2 className="w-4 h-4 text-rose-500" />
                      {item}
                   </div>
                 ))}
              </div>
           </div>
           <div className="md:col-span-1"></div>
           <div className="md:col-span-4 relative z-10">
              <button className="w-full bg-rose-600 text-white font-bold py-6 rounded-full hover:bg-rose-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                 Report a Breach <ChevronRight className="w-5 h-5" />
              </button>
              <div className="mt-6 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                 Public Key Index: SEC_9921_PRT
              </div>
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default Security;
