import React from 'react';
import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SEO } from '@/components/seo/SEO';
import { Rocket, Zap, Shield, Users, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StartupSolutions = () => {
  return (
    <PublicLayout title="HRMS for Tech Startups">
      <SEO 
        title="Fastest HR for Tech Startups | Scalable Fast HRMS Solution"
        description="The world's fastest HRMS built for high-growth tech startups. Scale from 1 to 1000+ employees with zero friction, automated compliance, and real-time equity tracking."
        keywords="HRMS for startups, fast HR software for tech companies, scalable HR platform, startup payroll automation"
        type="website"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Solutions', path: '/' },
          { name: 'Tech Startups', path: '/solutions/startups' }
        ]}
      />

      <div className="relative z-10 space-y-32 py-10 px-6">
        {/* Startup Hero */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20"
          >
            <Rocket className="w-10 h-10 text-black" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white mb-8 leading-tight">
            Scale at the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 italic">Speed of Thought.</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Legacy HRMS is where startup momentum goes to die. FastestHR is the only operating system designed for the chaos of hyper-growth.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/register" className="h-16 px-10 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Launch Protocol <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Feature Comparison / Highlights for Startups */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="p-12 rounded-[3rem] bg-[#050505] border border-white/5 space-y-8">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
               <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-white">Zero-Friction <br /> Onboarding.</h2>
            <p className="text-zinc-500 text-lg leading-relaxed font-outfit">
              Moving from spreadsheets or archaic tools? Our migration engine ingests your CSVs, PDF contracts, and scattered data in minutes. 
            </p>
            <ul className="space-y-4">
              {['Auto-generate offer letters', 'Instant hardware procurement', 'Slack-native onboarding'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-indigo-900/20 to-black border border-white/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Shield className="w-64 h-64 text-indigo-400" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
               <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-white">Compliance <br /> Autopilot.</h2>
            <p className="text-zinc-500 text-lg leading-relaxed font-outfit">
              Hiring your first remote engineer in Berlin? We handle the local contracts, tax nexus, and localized benefits so you don't have to hire a legal team.
            </p>
            <button className="text-indigo-400 font-bold flex items-center gap-2 group">
              Explore Compliance Rails <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </section>

        {/* Startup Specific CTA */}
        <section className="py-32 text-center bg-white/[0.02] rounded-[4rem] border border-white/5">
           <h2 className="text-5xl font-bold text-white mb-8">Stop fighting your tools. <br /> <span className="text-cyan-400">Start building your team.</span></h2>
           <p className="text-zinc-400 mb-12 max-w-xl mx-auto italic font-mono text-sm opacity-60">"The difference between landing top talent and losing them is 48 hours of HR delay."</p>
           <Link to="/register" className="inline-flex h-16 items-center px-12 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all font-bold">
             Claim Your Startup Domain
           </Link>
        </section>
      </div>
    </PublicLayout>
  );
};

export default StartupSolutions;
