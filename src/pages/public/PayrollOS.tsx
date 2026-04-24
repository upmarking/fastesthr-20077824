import { motion, useScroll, useTransform } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DollarSign, Globe, ShieldCheck, TrendingUp, CreditCard, Banknote, RefreshCcw, Landmark } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';

const PayrollOS = () => {
  const { scrollYProgress } = useScroll();
  const yWave = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <PublicLayout title="Payroll OS">
      <SEO 
        title="Zero-Trust Payroll OS | Automated Global Payouts | FastestHR"
        description="Automate payroll across 150+ jurisdictions with zero-trust security. Instant settlements and autonomous tax compliance for global workforces."
        keywords="zero-trust payroll, global payroll automation, international tax compliance software, instant payroll settlement"
        type="software"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Platform', path: '/' },
          { name: 'Payroll OS', path: '/platform/payroll-os' }
        ]}
      />
      <div className="relative z-10 space-y-32 py-10">
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden rounded-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent -z-10"></div>
          
          {/* Animated Liquid Background SVG */}
          <div className="absolute bottom-0 left-0 w-full h-full -z-10 opacity-30">
            <motion.svg 
              style={{ y: yWave }}
              viewBox="0 0 1440 320" 
              className="absolute bottom-0"
              preserveAspectRatio="none"
            >
              <path fill="#10b981" fillOpacity="0.2" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </motion.svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl px-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">Liquidity Protocol Active</span>
            </div>
            <h1 className="font-syne text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-tight">
              Liquid <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">Payroll.</span>
            </h1>
            <p className="font-outfit text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Automate the flow of value across 150+ jurisdictions. Instant settlements, autonomous tax compliance, and seamless cross-border distribution.
            </p>
          </motion.div>
        </section>

        {/* Feature Grid: Emerald Focus */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
          {/* Card 1 */}
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            className="group p-10 rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Globe className="w-10 h-10 text-emerald-500 mb-8" />
            <h3 className="font-syne text-2xl font-bold text-white mb-4">Planetary Reach</h3>
            <p className="font-outfit text-zinc-500 leading-relaxed">
              One-click global distribution. We handle local labor laws, multi-currency conversions, and localized benefits automatically.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-10 rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden"
          >
            <ShieldCheck className="w-10 h-10 text-emerald-400 mb-8" />
            <h3 className="font-syne text-2xl font-bold text-white mb-4">Autonomous Compliance</h3>
            <p className="font-outfit text-zinc-500 leading-relaxed">
              Reg-tech protocols that monitor tax law changes in real-time. We guarantee 100% compliance across all active tax jurisdictions.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group p-10 rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-emerald-500/30 transition-all relative overflow-hidden"
          >
            <RefreshCcw className="w-10 h-10 text-emerald-300 mb-8" />
            <h3 className="font-syne text-2xl font-bold text-white mb-4">Instant Settlement</h3>
            <p className="font-outfit text-zinc-500 leading-relaxed">
              Ditch the 3-day lead times. Same-day deposits for your entire workforce, regardless of where they bank or live.
            </p>
          </motion.div>
        </section>

        {/* Integration Highlight */}
        <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-8">
                 <h2 className="font-syne text-4xl md:text-5xl font-bold text-white leading-tight">Banking <br /> Orchestration.</h2>
                 <p className="font-outfit text-zinc-400 text-lg leading-relaxed">
                   Native integration with 5,000+ global banks. Our platform acts as a secure buffer, orchestrating massive financial movements with cryptographic precision.
                 </p>
                 <div className="flex gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                       <Landmark className="w-5 h-5 text-emerald-400" />
                       <span className="text-sm text-zinc-300">Direct SEPA/SWIFT</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                       <CreditCard className="w-5 h-5 text-emerald-400" />
                       <span className="text-sm text-zinc-300">Fast-Track Rails</span>
                    </div>
                 </div>
              </div>
              <div className="rounded-[2rem] bg-black/40 border border-white/5 p-8 backdrop-blur-3xl space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-zinc-500 font-mono text-xs uppercase">Payout Cycle #429</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                 </div>
                 <div className="space-y-4">
                    {[
                      { name: 'Engineering Core', amount: '$42,500.00', status: 'Settled' },
                      { name: 'Marketing Apex', amount: '$12,200.00', status: 'Processing' },
                      { name: 'Research Node', amount: '$8,400.00', status: 'Settled' },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center group">
                        <span className="text-zinc-300">{row.name}</span>
                        <div className="text-right">
                          <div className="text-white font-mono">{row.amount}</div>
                          <div className={`text-[10px] uppercase font-bold ${row.status === 'Settled' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>{row.status}</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default PayrollOS;
