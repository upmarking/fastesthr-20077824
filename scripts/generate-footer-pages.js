const fs = require('fs');
const path = require('path');

const pagesDir = path.join('src', 'pages', 'public');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

const pages = [
  { name: 'CoreEngine', title: 'Core Engine' },
  { name: 'PayrollOS', title: 'Payroll OS' },
  { name: 'TalentPipeline', title: 'Talent Pipeline' },
  { name: 'APIDocs', title: 'API Docs' },
  { name: 'About', title: 'About' },
  { name: 'Careers', title: 'Careers' },
  { name: 'Changelog', title: 'Changelog' },
  { name: 'TermsOfService', title: 'Terms of Service' },
  { name: 'PrivacyPolicy', title: 'Privacy Policy' },
  { name: 'Security', title: 'Security' }
];

pages.forEach(p => {
  const content = `import { PublicLayout } from '@/components/layout/PublicLayout';

const ${p.name} = () => {
  return (
    <PublicLayout title="${p.title}">
      <div className="space-y-6 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">${p.title}</h1>
        <p className="text-zinc-400 font-light text-lg leading-relaxed">
          This is the ${p.title} page for FastestHR. Content is being updated.
        </p>
        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500/20 to-transparent mt-8"></div>
      </div>
    </PublicLayout>
  );
};

export default ${p.name};
`;
  fs.writeFileSync(path.join(pagesDir, `${p.name}.tsx`), content);
});
console.log('Pages created!');
