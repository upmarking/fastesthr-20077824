const fs = require('fs');
const path = require('path');

const pagesDir = path.join('src', 'pages', 'public');

// Helper to escape backticks and dollar signs if needed
const writePage = (name, content) => {
  fs.writeFileSync(path.join(pagesDir, `${name}.tsx`), content);
};

writePage('CoreEngine', `import { PublicLayout } from '@/components/layout/PublicLayout';
import { Database, Zap, Cpu, ArrowRight } from 'lucide-react';

const CoreEngine = () => {
  return (
    <PublicLayout title="Core Engine">
      <div className="space-y-12 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 mb-6">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            The Neural Core Engine
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            The fastest, most resilient HR database ever built. Operates on a sub-millisecond graph architecture delivering infinite scalability and zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group">
            <Database className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Graph Intelligence</h3>
            <p className="text-zinc-500 leading-relaxed">Map complex organizational structures dynamically. No more rigid hierarchical tables.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group">
            <Zap className="w-8 h-8 text-cyan-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Sub-millisecond Queries</h3>
            <p className="text-zinc-500 leading-relaxed">Built on a proprietary caching layer that outpaces traditional SQL queries by 100x.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group">
            <Cpu className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Event-Driven Architecture</h3>
            <p className="text-zinc-500 leading-relaxed">Every action triggers real-time webhooks, seamlessly flowing data to your entire stack.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CoreEngine;
`);

writePage('PayrollOS', `import { PublicLayout } from '@/components/layout/PublicLayout';
import { DollarSign, Globe, ShieldCheck } from 'lucide-react';

const PayrollOS = () => {
  return (
    <PublicLayout title="Payroll OS">
      <div className="space-y-12 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 mb-6">
            <DollarSign className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Global Payroll OS
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            Run payroll for 1-100,000 employees globally in milliseconds. Built-in compliance, automatic tax deductions, and instant direct deposits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111] to-black border border-white/5">
            <Globe className="w-8 h-8 text-blue-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">150+ Countries Supported</h3>
            <p className="text-zinc-500 leading-relaxed">Pay your globally distributed team in their local currency without exorbitant exchange fees.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111] to-black border border-white/5">
            <ShieldCheck className="w-8 h-8 text-green-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Auto-Compliance Tax Engine</h3>
            <p className="text-zinc-500 leading-relaxed">Never worry about tax law changes. Our system automatically updates local tax brackets and labor laws weekly.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PayrollOS;
`);

writePage('TalentPipeline', `import { PublicLayout } from '@/components/layout/PublicLayout';
import { Users, Filter, Rocket } from 'lucide-react';

const TalentPipeline = () => {
  return (
    <PublicLayout title="Talent Pipeline">
      <div className="space-y-12 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400 mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
            Intelligent ATS Pipeline
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            Source, screen, and hire 10x faster. Let the machine handle the scheduling and parsing while you focus on the human connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5">
            <Filter className="w-8 h-8 text-pink-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Smart Parsing</h3>
            <p className="text-zinc-500 leading-relaxed">AI automatically extracts skills, experience, and contact info from any resume format.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5">
            <Rocket className="w-8 h-8 text-orange-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Automated Workflows</h3>
            <p className="text-zinc-500 leading-relaxed">Trigger assessment tests, interview invites, and background checks based on pipeline stages.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5">
            <Users className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Collaborative Hiring</h3>
            <p className="text-zinc-500 leading-relaxed">Leave private notes, scorecards, and @mention your team directly within candidate profiles.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TalentPipeline;
`);

writePage('APIDocs', `import { PublicLayout } from '@/components/layout/PublicLayout';
import { Terminal } from 'lucide-react';

const APIDocs = () => {
  return (
    <PublicLayout title="API Documentation">
      <div className="space-y-12 pt-10 pb-20">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Developer API</h1>
          </div>
          <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
            Integrate FastestHR completely into your custom stack using our REST and GraphQL APIs.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-[#111] flex items-center justify-between">
              <span className="text-sm font-mono text-cyan-400 font-semibold">GET /v2/employees</span>
              <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">REST</span>
            </div>
            <div className="p-6">
              <p className="text-zinc-400 mb-4 text-sm">Fetch a paginated list of all active employees in the organization.</p>
              <pre className="bg-black border border-white/10 rounded-xl p-4 overflow-x-auto text-sm font-mono text-zinc-300">
                <code className="block text-emerald-400">curl <span className="text-zinc-300">-X GET</span> "https://api.fastesthr.com/v2/employees" \</code>
                <code className="block text-zinc-300">  -H <span className="text-amber-300">"Authorization: Bearer YOUR_API_KEY"</span></code>
              </pre>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-[#111] flex items-center justify-between">
              <span className="text-sm font-mono text-emerald-400 font-semibold">POST /v2/webhooks</span>
              <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">Webhooks</span>
            </div>
            <div className="p-6">
              <p className="text-zinc-400 mb-4 text-sm">Register a new webhook endpoint to receive real-time events.</p>
              <pre className="bg-black border border-white/10 rounded-xl p-4 overflow-x-auto text-sm font-mono text-zinc-300">
                <code className="block text-emerald-400">curl <span className="text-zinc-300">-X POST</span> "https://api.fastesthr.com/v2/webhooks" \</code>
                <code className="block text-zinc-300">  -H <span className="text-amber-300">"Content-Type: application/json"</span> \</code>
                <code className="block text-zinc-300">  -d '{"{"}"url": "https://yourapp.com/webhook", "events": ["employee.created"]{"}"}'</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default APIDocs;
`);

writePage('About', `import { PublicLayout } from '@/components/layout/PublicLayout';

const About = () => {
  return (
    <PublicLayout title="About Us">
      <div className="space-y-12 pt-10 pb-20 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">We're fixing the broken OS of work.</h1>
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-zinc-400 leading-relaxed">
            FastestHR was born out of profound frustration. After scaling engineering teams at hyper-growth startups, we realized that while dev-tools evolved rapidly, HR software remained stuck in the 2000s—clunky, utterly slow, and hostile to developers.
          </p>
          <p className="text-zinc-400 leading-relaxed mt-6">
            We are building the definitive API-first, brutally-fast operating system for global workforces. No loading spinners. No hidden menus. Just a perfectly orchestrated symphony of data and design.
          </p>
          
          <div className="mt-12 p-8 bg-gradient-to-br from-[#111] to-black border border-white/5 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
            <ul className="space-y-4 text-zinc-400">
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">01</span> Performance is a feature, not an afterthought.</li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">02</span> Design with immense respect for the user's time.</li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">03</span> Default to zero-trust security.</li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">04</span> API-first architecture always wins.</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
`);

writePage('Careers', `import { PublicLayout } from '@/components/layout/PublicLayout';
import { ArrowRight, Code, Terminal, Cpu } from 'lucide-react';

const Careers = () => {
  return (
    <PublicLayout title="Careers">
      <div className="space-y-12 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
            Build the Future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Workforce Tech</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            Join a remote-first team of elite engineers, designers, and thinkers. We offer top-percentile compensation, unlimited PTO, and immense autonomy.
          </p>
        </div>

        <div className="mt-16 space-y-4 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Open Engineering Roles</h3>
          
          <div className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/50 rounded-2xl transition-all cursor-pointer">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Code className="w-6 h-6" /></div>
              <div>
                <h4 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">Senior Frontend Engineer (React/WebGL)</h4>
                <p className="text-sm text-zinc-500 mt-1">Remote (Americas/EMEA) • $160K - $210K</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/50 rounded-2xl transition-all cursor-pointer">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Terminal className="w-6 h-6" /></div>
              <div>
                <h4 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">Backend Systems Engineer (Go/Rust)</h4>
                <p className="text-sm text-zinc-500 mt-1">Remote (Global) • $150K - $200K</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/50 rounded-2xl transition-all cursor-pointer">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400"><Cpu className="w-6 h-6" /></div>
              <div>
                <h4 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">Machine Learning Researcher</h4>
                <p className="text-sm text-zinc-500 mt-1">Remote/San Francisco • $180K - $250K</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Careers;
`);

writePage('Changelog', `import { PublicLayout } from '@/components/layout/PublicLayout';

const Changelog = () => {
  return (
    <PublicLayout title="Changelog">
      <div className="space-y-12 pt-10 pb-20 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-12">Product Updates</h1>
        
        <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0a0a0a] group-[.is-active]:bg-cyan-900 text-cyan-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-5 md:ml-0">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 font-mono text-sm font-bold">v2.0</span>
                <span className="text-zinc-500 text-sm">March 2026</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Neural Engine Live</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">We completely rewrote our Core Engine in Rust, dropping average query times from 50ms to 0.4ms. Introduced the new AI-driven anomaly detection for payroll.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0a0a0a] text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-5 md:ml-0">
              <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-mono text-sm font-bold">v1.8</span>
                <span className="text-zinc-500 text-sm">December 2025</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Tax Compliance API</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Added support for automatic tax deduction calculation across 150+ countries. New Graph API endpoints for customized external routing.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0a0a0a] text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-5 md:ml-0">
              <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-mono text-sm font-bold">v1.5</span>
                <span className="text-zinc-500 text-sm">August 2025</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Holo UI Interface Rebuild</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Transitioned entire frontend dashboard to a GPU-accelerated framer-motion interface, making interactions incredibly snappy.</p>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default Changelog;
`);

writePage('Security', `import { PublicLayout } from '@/components/layout/PublicLayout';
import { Shield, Lock, EyeOff } from 'lucide-react';

const Security = () => {
  return (
    <PublicLayout title="Security">
      <div className="space-y-12 pt-10 pb-20">
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6">Zero-Trust Security architecture.</h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            We handle the most sensitive data your company possesses. Security isn't a feature; it is the non-negotiable foundation of our entire protocol stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <Shield className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">SOC 2 Type II Certified</h3>
            <p className="text-sm text-zinc-500">Regularly audited by third-party firms. We maintain strict compliance with SOC 2, ISO 27001, and HIPAA where applicable.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <Lock className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">AES-256 Encryption</h3>
            <p className="text-sm text-zinc-500">All data is encrypted at rest using AES-256 and in transit via TLS 1.3. Cryptographic hashing for all authentication tokens.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <EyeOff className="w-8 h-8 text-rose-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Zero-Trust Boundaries</h3>
            <p className="text-sm text-zinc-500">Network micro-segmentation ensures that a compromise in one service absolutely cannot propagate to another.</p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#111] border border-white/5 rounded-2xl max-w-3xl">
          <h3 className="text-xl font-bold text-white mb-4">Vulnerability Disclosure</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            We operate a private bug bounty program via HackerOne. If you believe you’ve found a security vulnerability in FastestHR, please report it immediately.
          </p>
          <button className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors">
            Report Vulnerability
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Security;
`);

writePage('PrivacyPolicy', `import { PublicLayout } from '@/components/layout/PublicLayout';

const PrivacyPolicy = () => {
  return (
    <PublicLayout title="Privacy Policy">
      <div className="pt-10 pb-20 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">Privacy Protocol</h1>
        <p className="text-zinc-500 text-sm font-mono mb-12">Last Updated: March 26, 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none">
          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Aggregation & Collection</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            FastestHR collects the bare minimum data required to facilitate the operational OS functions. This includes cryptographic identifiers, platform usage telemetry, and explicitly provided HR metrics. We DO NOT monitor off-platform activity or sell telemetry curves to third-party ad networks.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Processing Mechanisms</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Our neural engine processes your data solely within the isolated execution environments provisioned for your tenant. We process this data to provide automated payroll compliance, recruitment scoring, and algorithmic schedule optimization.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Subprocessors & Interfacing</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            We utilize top-tier infrastructure providers (AWS, Cloudflare, Supabase) bound by identical or stricter confidentiality SLAs. A full list of active Subprocessors is available on demand to enterprise tier administrators via the compliance dashboard.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">4. The Right to Erasure</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            You hold absolute sovereignty over your tenant's data payload. Execution of a deletion protocol permanently unlinks and overwrites the raw data across all main nodes within 72 hours, and cascading backups within 30 days.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
`);

writePage('TermsOfService', `import { PublicLayout } from '@/components/layout/PublicLayout';

const TermsOfService = () => {
  return (
    <PublicLayout title="Terms of Service">
      <div className="pt-10 pb-20 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">Terms of Service</h1>
        <p className="text-zinc-500 text-sm font-mono mb-12">Effective Date: March 26, 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            By initializing a connection to the FastestHR interface, API endpoints, or CLI tools, you hereby agree to these Terms. If you do not agree to these Terms, you are prohibited from utilizing the Protocol.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. License and Access Protocols</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            We grant you a limited, non-exclusive, non-transferable runtime execution license to utilize the FastestHR Platform. You may not reverse-engineer, decompile, or aggressively load-test our infrastructure without express cryptographic consent.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Service Level Agreement (SLA)</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            We guarantee a 99.99% multi-region uptime. Service disruption events crossing this threshold trigger automatic SLA credit payouts directly to the tenant's billing profile. Scheduled maintenance packets will be broadcasted 72 hours in advance.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Customer Data Obligations</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            You retain all localized rights to your data payloads. You are solely responsible for ensuring that any data injected into our system complies with local labor laws, privacy mandates, and consent frameworks.
          </p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">4. API Usage and Rate Limiting</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            API endpoints are heavily rate-limited based on your subscription tier. Automated scripts circumventing these limitations will result in instant token invalidation.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;
`);

console.log('Successfully wrote exact Page components directly to disk.');
