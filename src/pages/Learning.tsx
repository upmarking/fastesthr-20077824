import { ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Learning() {
  const learningUrl = "https://learn.weskill.org/courses";

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Premium Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Continuous Learning
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Expand your skills with our curated course catalog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 hover:bg-primary/5 group transition-all"
            onClick={() => window.open(learningUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> 
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 w-full rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <iframe
          src={learningUrl}
          className="w-full h-full border-none rounded-2xl"
          title="WeSkill Learning Courses"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
