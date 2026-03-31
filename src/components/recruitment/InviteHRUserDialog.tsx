import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';

interface InviteHRUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usedLicences: number;
  totalLicences: number;
}

export function InviteHRUserDialog({
  open,
  onOpenChange,
  usedLicences,
  totalLicences,
}: InviteHRUserDialogProps) {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    role: 'recruiter' as 'recruiter' | 'hr_manager',
    managerId: '',
  });

  const licenceFull = usedLicences >= totalLicences;

  // Fetch HR Managers for the manager selector
  const { data: hrManagers = [] } = useQuery({
    queryKey: ['hr-managers', profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('company_id', profile!.company_id!)
        .eq('platform_role', 'hr_manager')
        .eq('is_active', true)
        .order('full_name');
      return data || [];
    },
    enabled: !!profile?.company_id && open,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error('No company');
      if (licenceFull) throw new Error('Licence limit reached');

      // 1. Create invitation in DB
      const { data: invitation, error: invErr } = await supabase
        .from('invitations')
        .insert({
          company_id: profile.company_id,
          email: formData.email.trim().toLowerCase(),
          invited_by: profile.id,
          // Store role info in invitation via meta — we'll handle on accept
        })
        .select()
        .single();

      if (invErr) throw invErr;

      // 2. Send magic link via Supabase Auth
      // We pass the company_id, platform_role, and manager_id in the 'data' options
      // so the database trigger 'handle_new_user' assigns them automatically upon signup.
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: formData.email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            company_id: profile.company_id,
            platform_role: formData.role,
            manager_id: formData.managerId || null,
            full_name: formData.email.trim().toLowerCase().split('@')[0] // Fallback name
          }
        },
      });

      if (otpErr) throw otpErr;
      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-team', profile?.company_id] });
      toast.success(`Invitation sent to ${formData.email}`);
      setFormData({ email: '', role: 'recruiter', managerId: '' });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    if (formData.role === 'recruiter' && !formData.managerId && hrManagers.length > 0) {
      toast.error('Please assign a manager for this recruiter');
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite HR Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to add a Recruiter or HR Manager to your team.
          </DialogDescription>
        </DialogHeader>

        {licenceFull && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Licence limit reached ({usedLicences}/{totalLicences}). Upgrade your plan to add more users.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address *</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="recruiter@company.com"
              disabled={mutation.isPending || licenceFull}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => setFormData({ ...formData, role: v as any, managerId: '' })}
              disabled={mutation.isPending || licenceFull}
            >
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="hr_manager">HR Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === 'recruiter' && (
            <div className="space-y-2">
              <Label htmlFor="invite-manager">Reporting Manager</Label>
              <Select
                value={formData.managerId}
                onValueChange={(v) => setFormData({ ...formData, managerId: v })}
                disabled={mutation.isPending || licenceFull}
              >
                <SelectTrigger id="invite-manager">
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {hrManagers.length === 0 ? (
                    <SelectItem value="none" disabled>No HR Managers yet</SelectItem>
                  ) : (
                    hrManagers.map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending || licenceFull}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mutation.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
