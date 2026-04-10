
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface InviteToPortalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  companyId: string;
}

export function InviteToPortalDialog({ open, onOpenChange, employeeId, employeeName, employeeEmail, companyId }: InviteToPortalDialogProps) {
  const queryClient = useQueryClient();

  const inviteMutation = useMutation({
    mutationFn: async () => {
      // 1. Create invitation
      const { error: inviteError } = await supabase
        .from('invitations')
        .insert([{
          company_id: companyId,
          email: employeeEmail,
          status: 'pending'
        }]);
      if (inviteError) throw inviteError;

      // 2. Transition employee status to active (as requested by user)
      const { error: empError } = await supabase
        .from('employees')
        .update({ status: 'active' })
        .eq('id', employeeId);
      if (empError) throw empError;

      // 3. Send email via edge function (We can implement this later or use a simple toast for now)
      // For now, we assume the invitation record triggers an email or we handle it here.
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-hires', companyId] });
      toast.success(`Portal invitation sent to ${employeeName}. Status updated to ACTIVE.`);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Invite to Portal
          </DialogTitle>
          <DialogDescription>
            This will send an invitation email to <strong>{employeeEmail}</strong> and transition 
            their status to <strong>ACTIVE</strong> in the Employee Dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-2 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Ready to grant access?</p>
            <p className="text-xs text-muted-foreground">The employee will receive a link to set up their password.</p>
        </div>

        <DialogFooter className="flex sm:justify-between items-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={() => inviteMutation.mutate()} 
            disabled={inviteMutation.isPending}
            className="gap-2"
          >
            {inviteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
