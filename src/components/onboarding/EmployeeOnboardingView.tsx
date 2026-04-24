
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Upload, CheckCircle2, Circle, 
  Loader2, PartyPopper, AlertCircle, Eye,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeOnboardingViewProps {
  employeeId: string;
  companyId: string;
}

export function EmployeeOnboardingView({ employeeId, companyId }: EmployeeOnboardingViewProps) {
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [textValues, setTextValues] = useState<Record<string, string>>({});

  // Fetch Definitions
  const { data: steps = [] } = useQuery({
    queryKey: ['onboarding-steps', companyId],
    queryFn: async () => {
      const { data } = await supabase.from('onboarding_steps').select('*').eq('company_id', companyId).order('order_index');
      return data || [];
    },
  });

  const { data: docRequirements = [] } = useQuery({
    queryKey: ['onboarding-doc-requirements', companyId],
    queryFn: async () => {
      const { data } = await supabase.from('onboarding_document_requirements').select('*').eq('company_id', companyId).order('created_at');
      return data || [];
    },
  });

  // Fetch Progress
  const { data: stepProgress = [] } = useQuery({
    queryKey: ['onboarding-progress', employeeId],
    queryFn: async () => {
      const { data } = await supabase.from('onboarding_progress').select('*').eq('employee_id', employeeId);
      return data || [];
    },
  });

  const { data: docSubmissions = [] } = useQuery({
    queryKey: ['onboarding-doc-submissions', employeeId],
    queryFn: async () => {
      const { data } = await supabase.from('onboarding_document_submissions').select('*').eq('employee_id', employeeId);
      return data || [];
    },
  });

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: async ({ requirementId, file }: { requirementId: string, file: File }) => {
      setUploadingId(requirementId);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `onboarding/${employeeId}/${requirementId}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('onboarding_document_submissions')
        .insert({
          employee_id: employeeId,
          requirement_id: requirementId,
          file_url: filePath,
          status: 'pending'
        });
      
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-doc-submissions', employeeId] });
      toast.success('Document uploaded successfully');
      setUploadingId(null);
    },
    onError: (error: any) => {
      toast.error('Upload failed: ' + error.message);
      setUploadingId(null);
    }
  });

  const submitTextMutation = useMutation({
    mutationFn: async ({ requirementId, text }: { requirementId: string, text: string }) => {
      const { error } = await supabase
        .from('onboarding_document_submissions')
        .insert({
          employee_id: employeeId,
          requirement_id: requirementId,
          text_content: text,
          status: 'pending'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-doc-submissions', employeeId] });
      toast.success('Information submitted');
    },
  });

  const totalPossible = steps.length + docRequirements.length;
  const totalDone = stepProgress.length + docSubmissions.length;
  const overallPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Card */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary to-primary-foreground text-white shadow-xl shadow-primary/20">
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                Welcome Aboard! <PartyPopper className="h-8 w-8 text-white/80" />
              </h2>
              <p className="text-white/70 max-w-md">
                We're excited to have you join our team. Please complete the following steps to finalize your onboarding.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <span className="text-5xl font-black">{overallPct}%</span>
              <span className="text-xs uppercase tracking-widest font-bold opacity-70">Complete</span>
              <Progress value={overallPct} className="h-1.5 w-32 bg-white/20" />
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Document Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Upload Documents</h3>
          </div>
          
          <div className="space-y-3">
            {docRequirements.map((req: any) => {
              const submission = docSubmissions.find((s: any) => s.requirement_id === req.id);
              const isUploading = uploadingId === req.id;

              return (
                <Card key={req.id} className={`transition-all ${submission ? 'bg-success/5 border-success/20' : 'bg-card'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{req.title}</h4>
                          {req.is_mandatory && !submission && <Badge variant="outline" className="text-[9px] h-4 border-amber-500/30 text-amber-600 bg-amber-500/5">REQUIRED</Badge>}
                          {submission && <Badge className="bg-success text-white text-[9px] h-4">COMPLETED</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{req.description}</p>
                      </div>
                      <div className="shrink-0 pt-1">
                        {submission ? (
                          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Upload className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {!submission && (
                      <div className="mt-4 pt-4 border-t border-dashed">
                        {req.type === 'file' ? (
                          <div className="flex items-center gap-3">
                            <Input 
                              type="file" 
                              className="text-xs h-9 cursor-pointer" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  uploadMutation.mutate({ requirementId: req.id, file });
                                }
                              }}
                              disabled={isUploading}
                            />
                            {isUploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Textarea 
                                placeholder="Enter required info..." 
                                className="text-xs min-h-[80px]"
                                value={textValues[req.id] || ''}
                                onChange={(e) => setTextValues(p=>({...p, [req.id]: e.target.value}))}
                            />
                            <Button size="sm" className="w-full text-xs" onClick={() => submitTextMutation.mutate({ requirementId: req.id, text: textValues[req.id] })}>
                                Submit Information
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Task Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Onboarding Tasks</h3>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {steps.map((step: any) => {
                  const isDone = stepProgress.some((p: any) => p.step_id === step.id);
                  return (
                    <div key={step.id} className="p-5 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                      <div className="pt-1">
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${isDone ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                        {isDone && (
                            <p className="text-[10px] text-success font-medium mt-2 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Completed by HR
                            </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/30 rounded-2xl border border-dashed flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider">Note to Employee</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tasks in the checklist are marked off by HR once they verify the step is completed. 
                Documents you upload are immediately visible to the HR team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
