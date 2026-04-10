
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, CheckCircle2, Circle, ClipboardList, 
  Upload, Users as UsersIcon, Monitor, PartyPopper,
  Settings2, Hash, Mail
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';
import { OnboardingSettingsDialog } from '@/components/onboarding/OnboardingSettingsDialog';
import { AssignIdDialog } from '@/components/onboarding/AssignIdDialog';
import { InviteToPortalDialog } from '@/components/onboarding/InviteToPortalDialog';
import { toast } from 'sonner';

const iconMap: Record<string, any> = {
  PartyPopper,
  Upload,
  ClipboardList,
  Monitor,
  Users: UsersIcon,
};

export default function Onboarding() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdmin = profile?.platform_role === 'company_admin' || profile?.platform_role === 'super_admin' || profile?.platform_role === 'hr_manager';

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [assignIdOpen, setAssignIdOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Queries
  const { data: newHires = [], isLoading: isLoadingHires } = useQuery({
    queryKey: ['new-hires', profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select(`
          id, first_name, last_name, work_email, date_of_joining, status, 
          department_id, avatar_url, employee_code, departments(name)
        `)
        .eq('company_id', profile!.company_id!)
        .is('deleted_at', null)
        .in('status', ['probation', 'active'])
        .order('date_of_joining', { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  const { data: steps = [], isLoading: isLoadingSteps } = useQuery({
    queryKey: ['onboarding-steps', profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('company_id', profile!.company_id!)
        .order('order_index');
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  const { data: progress = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ['onboarding-progress', selectedEmployee],
    queryFn: async () => {
      const { data } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('employee_id', selectedEmployee!);
      return data || [];
    },
    enabled: !!selectedEmployee,
  });

  // Mutations
  const toggleStepMutation = useMutation({
    mutationFn: async ({ stepId, completed }: { stepId: string, completed: boolean }) => {
      if (completed) {
        // Mark as completed
        const { error } = await supabase
          .from('onboarding_progress')
          .upsert({
            employee_id: selectedEmployee!,
            step_id: stepId,
            completed_at: new Date().toISOString(),
            completed_by: profile!.id
          });
        if (error) throw error;
      } else {
        // Mark as incomplete
        const { error } = await supabase
          .from('onboarding_progress')
          .delete()
          .eq('employee_id', selectedEmployee!)
          .eq('step_id', stepId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', selectedEmployee] });
    },
    onError: (err: any) => {
      toast.error(`Error updating progress: ${err.message}`);
    }
  });

  // Helpers
  const recentHires = newHires.filter((e: any) => {
    if (!e.date_of_joining) return true; // Show them if join date missing
    const joinDate = new Date(e.date_of_joining);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return joinDate >= ninetyDaysAgo;
  });

  const selectedEmpData = newHires.find((e: any) => e.id === selectedEmployee);

  const getProgressPercentage = (empId: string) => {
    // This is tricky because we'd need progress for all employees. 
    // In a real app, I'd fetch progress counts in the newHires query using a view or aggregate.
    // For now, let's keep it simple: progress for the selected employee is known.
    // For others, 0% or empty.
    if (empId !== selectedEmployee) return 0;
    if (steps.length === 0) return 0;
    return Math.round((progress.length / steps.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
          <p className="text-muted-foreground mt-1">Digital onboarding workflow for new hires</p>
        </div>
        {isAdmin && (
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5" onClick={() => setSettingsOpen(true)}>
            <Settings2 className="h-4 w-4" />
            Onboarding Settings
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 flex items-center gap-4">
            <UserPlus className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Onboarding</p>
              <p className="text-3xl font-bold">{recentHires.filter((e: any) => e.status === 'probation').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="p-6 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Invited to Portal</p>
              <p className="text-3xl font-bold text-success">
                {recentHires.filter((e: any) => e.status === 'active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/5 to-transparent">
          <CardContent className="p-6 flex items-center gap-4">
            <Circle className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Actions Required</p>
              <p className="text-3xl font-bold text-warning">
                {recentHires.filter((e: any) => !e.employee_code).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Employee List */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base">New Hires</CardTitle>
            <CardDescription>Select an employee to manage</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingHires ? (
              <div className="p-4 space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : recentHires.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 px-4">
                <UserPlus className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No recent hires found</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentHires.map((emp: any) => {
                  const isSelected = selectedEmployee === emp.id;
                  const progressVal = isSelected ? getProgressPercentage(emp.id) : 0;
                  return (
                    <div
                      key={emp.id}
                      className={`p-4 cursor-pointer hover:bg-muted/30 transition-all ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                      onClick={() => setSelectedEmployee(emp.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/10">
                          <AvatarImage src={emp.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {emp.first_name?.[0]}{emp.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{emp.first_name} {emp.last_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className={`text-[9px] px-1 h-4 ${emp.status === 'active' ? 'bg-success/5 text-success border-success/20' : 'bg-warning/5 text-warning border-warning/20'}`}>
                              {emp.status.toUpperCase()}
                            </Badge>
                            {emp.employee_code && <span className="text-[10px] text-muted-foreground font-mono">{emp.employee_code}</span>}
                          </div>
                        </div>
                      </div>
                      <Progress value={progressVal} className="h-1 mt-3" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dashboard/Checklist Area */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedEmployee ? (
            <Card className="flex flex-col items-center justify-center py-24 text-center">
              <ClipboardList className="h-16 w-16 text-muted-foreground/10 mb-4" />
              <p className="text-muted-foreground">Select a new hire from the list to start the onboarding process</p>
            </Card>
          ) : (
            <>
              {/* Employee Quick Actions */}
              <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={selectedEmpData?.avatar_url || ''} />
                            <AvatarFallback>{selectedEmpData?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl">{selectedEmpData?.first_name} {selectedEmpData?.last_name}</CardTitle>
                            <CardDescription>{selectedEmpData?.work_email}</CardDescription>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        {!selectedEmpData?.employee_code && (
                           <Button size="sm" className="gap-2" onClick={() => setAssignIdOpen(true)}>
                             <Hash className="h-4 w-4" />
                             Assign ID
                           </Button>
                        )}
                        {selectedEmpData?.status === 'probation' && (
                           <Button size="sm" variant="secondary" className="gap-2" onClick={() => setInviteOpen(true)}>
                             <Mail className="h-4 w-4" />
                             Invite to Portal
                           </Button>
                        )}
                     </div>
                   </div>
                </CardHeader>
                <CardContent className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Progress</p>
                            <p className="text-xl font-bold text-primary">{getProgressPercentage(selectedEmployee)}%</p>
                        </div>
                        <div className="h-8 w-[1px] bg-border/50" />
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Joining Date</p>
                            <p className="text-sm font-medium">{selectedEmpData?.date_of_joining || 'Not Set'}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-border/50" />
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Department</p>
                            <p className="text-sm font-medium">{selectedEmpData?.departments?.name || 'Unassigned'}</p>
                        </div>
                    </div>
                </CardContent>
              </Card>

              {/* Checklist */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Onboarding Tasks</CardTitle>
                      <CardDescription>Track mandatory steps for successful onboarding</CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{progress.length} / {steps.length} Done</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {isLoadingSteps ? (
                        <div className="p-4 space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        steps.map((step: any) => {
                        const isCompleted = progress.some((p: any) => p.step_id === step.id);
                        const Icon = iconMap[step.icon_name || 'ClipboardList'] || ClipboardList;
                        
                        return (
                            <div
                            key={step.id}
                            className={`p-5 flex items-start gap-4 hover:bg-muted/20 transition-all ${isCompleted ? 'bg-success/5' : ''}`}
                            >
                            <div className="pt-0.5">
                                <Checkbox 
                                checked={isCompleted} 
                                onCheckedChange={(checked) => toggleStepMutation.mutate({ stepId: step.id, completed: !!checked })}
                                />
                            </div>
                            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>{step.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                            </div>
                            {isCompleted && (
                                <Badge variant="outline" className="border-success text-success bg-success/10 text-[10px]">VERIFIED</Badge>
                            )}
                            </div>
                        );
                        })
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {profile?.company_id && (
        <OnboardingSettingsDialog 
          open={settingsOpen} 
          onOpenChange={setSettingsOpen} 
          companyId={profile.company_id} 
        />
      )}

      {selectedEmployee && selectedEmpData && profile?.company_id && (
        <>
          <AssignIdDialog 
            open={assignIdOpen} 
            onOpenChange={setAssignIdOpen}
            employeeId={selectedEmployee}
            employeeName={`${selectedEmpData.first_name} ${selectedEmpData.last_name}`}
            companyId={profile.company_id}
          />
          <InviteToPortalDialog 
            open={inviteOpen}
            onOpenChange={setInviteOpen}
            employeeId={selectedEmployee}
            employeeName={`${selectedEmpData.first_name} ${selectedEmpData.last_name}`}
            employeeEmail={selectedEmpData.work_email}
            companyId={profile.company_id}
          />
        </>
      )}
    </div>
  );
}
