import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Shield, EyeOff, Lock, Database, Info, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    { title: 'Data Encryption', content: 'All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We do not store plain-text passwords or sensitive keys.' },
    { title: 'Zero Tracking', content: 'We do not sell your data. We do not track your users across the web. Our analytics are internal and anonymized.' },
    { title: 'Data Locality', content: 'Choose your region. We support multi-region data residency to comply with local laws like GDPR and CCPA.' },
    { title: 'Audit Logs', content: 'Every data mutation is logged in an immutable audit trail, accessible only by authorized administrators.' },
    { title: 'Protocol Integrity', content: 'We perform regular penetration tests and bounty programs to ensure the matrix remains secure.' },
  ];

  return (
    <PublicLayout title="Privacy Policy">
      <div className="relative z-10 space-y-24 py-10 max-w-4xl mx-auto">
        
        {/* Privacy Hero */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
            Protocol Status: Sealed
          </div>
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
            Data <span className="text-zinc-500">Sanctity.</span>
          </h1>
          <p className="font-outfit text-xl text-zinc-500 font-light max-w-2xl leading-relaxed">
            Your workforce data is a sovereign asset. We provide the infrastructure to protect it, not the permission to exploit it.
          </p>
        </section>

        {/* Policy Content */}
        <section className="space-y-12">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-[#050505] border border-white/5 hover:border-emerald-500/20 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all flex-shrink-0">
                    <Shield className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-syne text-xl font-bold text-white mb-2">{section.title}</h3>
                    <p className="font-outfit text-zinc-500 leading-relaxed">
                       {section.content}
                    </p>
                 </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Compliance Visualization */}
        <section className="p-12 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-8 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Lock className="w-48 h-48 text-white" />
           </div>
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="space-y-4 text-left">
                 <h2 className="font-syne text-3xl font-bold text-white">Compliance Standard</h2>
                 <p className="font-outfit text-zinc-500">Fully aligned with the highest global standards for data protection.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {['GDPR', 'SOC2 TYPE II', 'ISO 27001', 'HIPAA'].map(badge => (
                   <span key={badge} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest transition-all hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/50">
                      {badge}
                   </span>
                 ))}
              </div>
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
