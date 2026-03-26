import { useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Cpu, Shield, Zap, LayoutDashboard, Fingerprint, Layers, Activity, Users, DollarSign } from 'lucide-react';

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.title = "FastestHR | Next-Gen Workforce OS";
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-50 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Interactive Cursor Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-screen transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.07), transparent 40%)`
        }}
      />

      {/* Global Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[120px] bg-cyan-900/40 animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[150px] bg-indigo-900/30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_100%,transparent_100%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">FastestHR</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="relative group overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-medium transition-all hover:scale-105 duration-300">
              <span className="relative z-10 text-black">Get Started</span>
              <div className="absolute inset-0 h-full w-full scale-[2] blur-xl bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6 sm:pt-48 sm:pb-32 lg:pb-40">
        <motion.div style={{ opacity }} className="max-w-7xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">Intelligence Engine v2.0 Live</span>
            </motion.div>

            <motion.h1 
              variants={fadeIn}
              className="mt-6 font-extrabold text-transparent text-6xl sm:text-7xl lg:text-8xl tracking-tighter bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 pb-4 leading-[1.1]"
            >
              The Operating System <br className="hidden sm:block" />
              for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 animate-gradient-x">Workforce.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="mt-8 text-xl sm:text-2xl font-light text-zinc-400 max-w-3xl leading-relaxed">
              Ditch the archaic legacy tools. Experience a hyper-optimized, brutally efficient HR platform engineered for modern, scaling enterprises.
            </motion.p>

            <motion.div variants={fadeIn} className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 font-medium text-white transition-all hover:scale-105 duration-300 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                <span className="mr-2">Initialize Deployment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="group inline-flex h-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-600 px-8 font-medium text-zinc-300 backdrop-blur-md transition-all">
                Existing Link Protocol
              </Link>
            </motion.div>

          </motion.div>
        </motion.div>
      </main>

      {/* Stunning Interactive Dashboard Mockup */}
      <section className="relative z-20 w-full px-6 py-10 pb-32 perspective-1000">
        <motion.div 
          style={{ y: y1, rotateX: useTransform(scrollYProgress, [0, 0.5], [10, 0]), scale: useTransform(scrollYProgress, [0, 0.5], [0.95, 1]) }}
          className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#050505]/80 backdrop-blur-3xl p-3 shadow-[0_0_80px_rgba(0,0,0,1),_0_0_40px_rgba(34,211,238,0.15)] overflow-hidden relative group"
        >
          {/* Mockup Top Glow */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          
          <div className="relative w-full rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden flex flex-col shadow-inner">
            {/* Header */}
            <div className="flex h-14 w-full items-center justify-between border-b border-white/5 px-6 bg-[#0d0d0d]">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50 border border-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500"></div>
                </div>
                <div className="w-64 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center px-3 opacity-50">
                  <div className="w-4 h-4 text-zinc-500"><Shield className="w-full h-full" /></div>
                  <div className="ml-2 w-32 h-2 rounded bg-white/10"></div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center animate-pulse"><Zap className="w-4 h-4 text-cyan-400" /></div>
                <div className="w-8 h-8 rounded-full bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center"><Activity className="w-4 h-4 text-indigo-400" /></div>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex flex-1 p-6 gap-6 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]">
              {/* Sidebar */}
              <div className="w-56 hidden md:flex flex-col gap-3">
                <div className="h-10 w-full rounded-lg bg-zinc-900 border-l-2 border-cyan-500 flex items-center px-4 gap-3 text-cyan-400"><LayoutDashboard className="w-4 h-4" /> <div className="w-24 h-2 rounded bg-cyan-500/30"></div></div>
                <div className="h-10 w-full rounded-lg bg-transparent hover:bg-white/5 flex items-center px-4 gap-3 text-zinc-500"><Users className="w-4 h-4" /> <div className="w-20 h-2 rounded bg-zinc-700"></div></div>
                <div className="h-10 w-full rounded-lg bg-transparent hover:bg-white/5 flex items-center px-4 gap-3 text-zinc-500"><DollarSign className="w-4 h-4" /> <div className="w-28 h-2 rounded bg-zinc-700"></div></div>
                <div className="h-10 w-full rounded-lg bg-transparent hover:bg-white/5 flex items-center px-4 gap-3 text-zinc-500"><Layers className="w-4 h-4" /> <div className="w-16 h-2 rounded bg-zinc-700"></div></div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stat Card 1 */}
                  <div className="h-36 rounded-xl bg-gradient-to-b from-[#111] to-black border border-white/5 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4"><Users className="w-4 h-4" /></div>
                    <div className="text-3xl font-bold font-mono text-zinc-100 flex items-end gap-2">24,592 <span className="text-xs text-emerald-400 mb-1 flex items-center">↑ 14%</span></div>
                    <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Active Personnel</div>
                    {/* Tiny animated chart */}
                    <div className="absolute bottom-4 right-4 flex gap-1 items-end h-8">
                      {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.1 }} viewport={{ once: true }} className="w-2 bg-cyan-500/80 rounded-t-sm" />
                      ))}
                    </div>
                  </div>
                  {/* Stat Card 2 */}
                  <div className="h-36 rounded-xl bg-gradient-to-b from-[#111] to-black border border-white/5 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4"><Activity className="w-4 h-4" /></div>
                    <div className="text-3xl font-bold font-mono text-zinc-100 flex items-end gap-2">99.9% <span className="text-xs text-indigo-400 mb-1 flex items-center">Optimal</span></div>
                    <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">System Health</div>
                    {/* Tiny animated chart */}
                    <svg className="absolute bottom-4 right-4 w-24 h-8" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} d="M0,30 Q10,10 20,35 T40,20 T60,30 T80,10 T100,20" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
                      <motion.path initial={{ opacity: 0 }} whileInView={{ opacity: 0.2 }} transition={{ duration: 2 }} viewport={{ once: true }} d="M0,40 L0,30 Q10,10 20,35 T40,20 T60,30 T80,10 T100,20 L100,40 Z" fill="url(#grad)" stroke="none" />
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="transparent" /></linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {/* Stat Card 3 */}
                  <div className="h-36 rounded-xl bg-gradient-to-b from-[#111] to-black border border-white/5 p-5 relative overflow-hidden hidden md:block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4"><DollarSign className="w-4 h-4" /></div>
                    <div className="text-3xl font-bold font-mono text-zinc-100 flex items-end gap-2">$4.2M <span className="text-xs text-emerald-400 mb-1 flex items-center">↑ 8%</span></div>
                    <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Payroll Pipeline</div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full border-4 border-zinc-800 border-t-violet-500 border-r-violet-500 rotate-45"></div>
                  </div>
                </div>

                {/* Main Graph Area */}
                <div className="flex-1 rounded-xl bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#151515] to-transparent opacity-50"></div>
                  <div className="relative z-10 flex justify-between items-center mb-8">
                    <div>
                      <h4 className="text-zinc-100 font-medium">Workforce Productivity Matrix</h4>
                      <div className="text-xs text-zinc-500 font-mono mt-1">Real-time performance distribution</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">7D</div>
                      <div className="px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-xs text-cyan-400">30D</div>
                    </div>
                  </div>
                  {/* Glowing Advanced Graph */}
                  <div className="relative h-48 w-full mt-4 flex items-end justify-between px-2 gap-2">
                     {/* Background Grid */}
                     <div className="absolute inset-0 flex flex-col justify-between border-y border-white/5 z-0 pb-0">
                       <div className="w-full border-b border-white/5 border-dashed"></div>
                       <div className="w-full border-b border-white/5 border-dashed"></div>
                       <div className="w-full border-b border-white/5 border-dashed"></div>
                       <div className="w-full border-b border-white/5 border-dashed"></div>
                     </div>
                     {/* Bars */}
                     {[35, 45, 30, 60, 85, 55, 75, 95, 65, 80, 50, 70, 40].map((h, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ height: 0, opacity: 0 }}
                         whileInView={{ height: `${h}%`, opacity: 1 }}
                         transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                         viewport={{ once: true }}
                         className="relative z-10 flex-1 bg-gradient-to-t from-cyan-900/50 to-cyan-400 rounded-t-sm shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:from-cyan-800/80 hover:to-white transition-all cursor-pointer group/bar"
                       >
                         {/* Tooltip on hover */}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                           {Math.floor(h * 1.5)} pts
                         </div>
                       </motion.div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">Architected for</span> <br className="hidden md:block" />Infinite Velocity.</h2>
            <p className="mt-6 text-xl text-zinc-400 font-light max-w-2xl">Precision instruments designed to eliminate friction in every HR process, built for scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1, ease: "easeOut" } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
              >
                {/* Dynamic Feature Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-150 group-hover:rotate-12">
                  <feature.icon className="w-40 h-40 text-white" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center mb-8 text-zinc-400 group-hover:text-white transition-colors shadow-inner relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                    <feature.icon className="w-6 h-6 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-500 font-light leading-relaxed flex-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="relative z-10 py-32 border-t border-white/5 bg-[#030303]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-zinc-400 font-light">Everything you need to know about the platform.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 overflow-hidden border-t border-white/5 bg-black">
        <motion.div style={{ scale: useTransform(scrollYProgress, [0.8, 1], [0.95, 1]), opacity: useTransform(scrollYProgress, [0.8, 1], [0.5, 1]) }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08)_0,transparent_60%)]"></motion.div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative gap-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(34,211,238,0.4)] animate-bounce-slow">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-4 leading-tight">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Ready.</span></h2>
          <p className="text-2xl text-zinc-400 font-light mb-8 max-w-2xl leading-relaxed">Join thousands of high-velocity teams already running on the FastestHR protocol.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/register" className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-white px-12 font-medium text-black transition-all hover:scale-105 duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex-1 sm:flex-none">
              <span className="mr-3 text-lg font-bold tracking-tight">Commence Ignition</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// FAQ Component
const FAQItem = ({ question, answer, index }: { question: string, answer: string, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-white/5 rounded-2xl bg-[#0a0a0a] overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-white/[0.02] transition-colors"
      >
        <h4 className="text-xl font-bold text-zinc-200 pr-8">{question}</h4>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-cyan-400">
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-8 pb-6 text-zinc-400 font-light leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const features = [
  { icon: Cpu, title: "Neural Processing", desc: "Automate repetitive HR tasks instantly with our proprietary machine learning engine. Predict turnover and scale workforce automatically.", gradient: "from-cyan-500 to-blue-600" },
  { icon: Shield, title: "Quantum Security", desc: "Military-grade encryption for all your sensitive employee records and payroll data. Zero-trust architecture built-in by default.", gradient: "from-indigo-500 to-violet-600" },
  { icon: LayoutDashboard, title: "Holo UI Framework", desc: "A perfectly balanced, aesthetically uncompromising interface that respects your time. Driven by sub-millisecond response rates.", gradient: "from-rose-500 to-orange-600" },
  { icon: Layers, title: "Deep Integrations", desc: "Connect natively with your existing tech stack (Slack, Workday, Jira, GitHub) without pinging complex middleware.", gradient: "from-emerald-500 to-teal-600" },
  { icon: Fingerprint, title: "Biometric Access", desc: "Advanced attendance tracking with robust sub-millisecond precision protocols. Geographical spoof-prevention built-in.", gradient: "from-fuchsia-500 to-pink-600" },
  { icon: Activity, title: "Predictive Analytics", desc: "View real-time morale indicators, productivity drops, and key engagement metrics mapped beautifully on interactive charts.", gradient: "from-amber-500 to-yellow-600" }
];

const faqs = [
  { question: "How fast is the migration from our current legacy system?", answer: "Our onboarding matrix ingests data via CSV, API, or direct database connections. Typical enterprise migrations (1,000+ employees) take under 48 hours to fully resolve and render into our infrastructure." },
  { question: "Is the data secured with modern protocols?", answer: "Yes. All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We operate within a zero-trust architecture and regularly undergo penetration testing by independent security firms." },
  { question: "Can we integrate with our existing payroll software?", answer: "Absolutely. We offer native API webhooks that seamlessly feed attendance, leave, and compensation adjustments directly into systems like ADP, Gusto, and Workday without manual exports." },
  { question: "What is the uptime guarantee for the platform?", answer: "We provide an SLA-backed 99.99% multi-region uptime guarantee. Our edge network routing ensures lightning-fast performance globally, scaling instantly during high-traffic load events." }
];

export default Landing;
