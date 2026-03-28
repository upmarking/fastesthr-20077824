import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { FileText, Shield, Scale, AlertCircle, ChevronRight } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    { title: '1. Protocol Acceptance', content: 'By accessing the FastestHR (the "Service"), you agree to be bound by these Protocol Terms. If you do not agree to the terms, do not initialize a connection.' },
    { title: '2. Node Responsibilities', content: 'Users are responsible for maintaining the security of their access keys and for all activity occurring under their node ID. Any breach of security must be reported instantly.' },
    { title: '3. Data Sovereignty', content: 'You retain all rights to the data you input into the Service. We act as a neutral processor, executing mutations as directed by your authorized keys.' },
    { title: '4. Service Availability', content: 'We strive for 99.99% uptime. However, maintenance windows and emergency patches may cause transient latency. We are not liable for any data drift during these periods.' },
    { title: '5. Termination', content: 'We reserve the right to throttle or terminate any node that violates the protocol integrity or engages in malicious packet distribution.' },
  ];

  return (
    <PublicLayout title="Terms of Service">
      <div className="relative z-10 space-y-24 py-10 max-w-4xl mx-auto">
        
        {/* Legal Hero */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Last Mutation: March 24, 2026
          </div>
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
            Protocol <span className="text-zinc-500">Terms.</span>
          </h1>
          <p className="font-outfit text-xl text-zinc-500 font-light max-w-2xl leading-relaxed">
            The legally binding rules of engagement for the FastestHR infrastructure. Designed for clarity, executed for compliance.
          </p>
        </section>

        {/* Ledger Content */}
        <section className="space-y-12">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-[#050505] border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="md:w-64 flex-shrink-0">
                    <h3 className="font-syne text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{section.title}</h3>
                 </div>
                 <div className="flex-1">
                    <p className="font-outfit text-zinc-500 leading-relaxed">
                       {section.content}
                    </p>
                 </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Global Summary */}
        <section className="p-12 rounded-[3rem] bg-white/5 border border-white/10 space-y-6 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scale className="w-32 h-32 text-white" />
           </div>
           <AlertCircle className="w-10 h-10 text-zinc-500 mx-auto" />
           <h2 className="font-syne text-3xl font-bold text-white">Summary for Humans</h2>
           <p className="font-outfit text-zinc-500 max-w-xl mx-auto italic">
             "Basically: Use the platform responsibly, keep your keys safe, and your data stays your data. We handle the heavy lifting of the protocol."
           </p>
           <div className="pt-6">
              <button className="flex items-center gap-2 text-sm font-bold text-white hover:gap-4 transition-all mx-auto">
                 Download Full PDF Ledger <FileText className="w-4 h-4" />
              </button>
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default TermsOfService;
