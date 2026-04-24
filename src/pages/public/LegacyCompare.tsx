import React from 'react';
import { ComparisonLayout } from '@/components/layout/ComparisonLayout';

const LegacyCompare = () => {
  const features = [
    { name: "Synchronization Velocity", fastestHR: "Sub-millisecond", competitor: "Batch Processing (24h+)", desc: "Real-time data propagation across all global nodes." },
    { name: "Neural Automation", fastestHR: true, competitor: "Template-based", desc: "AI-driven decision making for recruitment and retention." },
    { name: "Zero-Trust Security", fastestHR: true, competitor: "Legacy ACL", desc: "Quantum-ready encryption for sensitive personnel records." },
    { name: "Implementation Speed", fastestHR: "Under 48 Hours", competitor: "3-6 Months", desc: "Rapid deployment protocol for scaling enterprises." },
    { name: "UX Response Time", fastestHR: "< 100ms", competitor: "2s - 5s", desc: "Aesthetically uncompromising interface built for speed." },
    { name: "Native Integrations", fastestHR: "Infinite (API-First)", competitor: "Restricted", desc: "Natively connect with Slack, GitHub, and modern stacks." }
  ];

  return (
    <ComparisonLayout 
      competitorName="Legacy HRMS"
      heroTitle="The Fastest HRMS vs. Legacies."
      heroDesc="Why high-velocity teams are abandoning archaic systems for the Fastest HR protocol. Break the bottleneck of legacy HR management."
      features={features}
      seoTitle="Fastest HR vs Legacy HRMS | Comparing the World's Fast HRMS"
      seoDesc="Discover why FastestHR is the ranked #1 Fast HRMS for scaling startups. Side-by-side comparison of synchronization speed, AI automation, and security."
      seoKeywords="Fastest HR vs Legacy, Fast HRMS comparison, modern HRMS benefits, HR software velocity"
    />
  );
};

export default LegacyCompare;
