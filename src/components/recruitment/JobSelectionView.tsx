import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Plus, Sparkles, ArrowRight, Zap, Target, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { JobActions } from './JobActions';

interface Job {
  id: string;
  title: string;
  departments?: { name: string };
  status?: string;
  created_at: string;
}

interface JobSelectionViewProps {
  jobs: Job[];
  onSelectJob: (id: string) => void;
  onCreateJob: () => void;
  loading: boolean;
  canManageJobs?: boolean;
}

export function JobSelectionView({ jobs, onSelectJob, onCreateJob, loading, canManageJobs }: JobSelectionViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[200px] animate-pulse bg-muted/20 border-border/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Talent Acquisition</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Talent Pipelines</h1>
        <p className="text-muted-foreground text-lg">
          Select a position to manage candidates, track progress, and leverage AI insights for your recruitment flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {/* New Job Card */}
        <motion.div
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="group h-full border-dashed border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all flex flex-col items-center justify-center p-8 space-y-4 text-center"
            onClick={onCreateJob}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Post New Job</h3>
              <p className="text-sm text-muted-foreground">Create a new position and start hiring</p>
            </div>
          </Card>
        </motion.div>

        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card 
              className="group h-full flex flex-col relative overflow-hidden bg-background/50 hover:bg-background border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
              onClick={() => onSelectJob(job.id)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowRight className="w-5 h-5 text-primary" />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-muted/50 border-none text-[10px] uppercase tracking-wider font-bold">
                    {job.departments?.name || 'General'}
                  </Badge>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{job.title}</CardTitle>
                <CardDescription className="text-xs">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              {canManageJobs && (
                <div 
                  className="absolute top-3 right-3 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <JobActions jobId={job.id} />
                </div>
              )}

              <CardContent className="mt-auto pt-4 border-t border-border/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium uppercase tracking-tight">Candidates</span>
                    </div>
                    <p className="font-bold text-lg">--</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-primary/70">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium uppercase tracking-tight">AI Rank</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary">
                      Ready
                    </Badge>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full mt-6 gap-2 group-hover:bg-primary group-hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                  Manage Pipeline
                  <Target className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
