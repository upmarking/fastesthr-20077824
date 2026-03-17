import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Loader2, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface OfferDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { 
    joiningDate: string; 
    payout: number; 
  }) => void;
  candidateName: string;
  defaultJoiningDate?: string;
  defaultPayout?: number;
  isSubmitting?: boolean;
}

export function OfferDetailsDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  candidateName,
  defaultJoiningDate,
  defaultPayout,
  isSubmitting = false
}: OfferDetailsDialogProps) {
  const [joiningDate, setJoiningDate] = useState('');
  const [payout, setPayout] = useState('');

  useEffect(() => {
    if (isOpen) {
      setJoiningDate(defaultJoiningDate || '');
      setPayout(defaultPayout ? defaultPayout.toString() : '');
    }
  }, [isOpen, defaultJoiningDate, defaultPayout]);

  const handleConfirm = () => {
    if (!joiningDate || !payout) {
      toast.error('Please fill in all fields');
      return;
    }
    onConfirm({
      joiningDate,
      payout: parseFloat(payout),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Finalize Offer Details</DialogTitle>
          <DialogDescription>
            Enter the offer details for <strong>{candidateName}</strong>. The offer letter template configured in stage automation will be used.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joining Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annual Payout (CTC)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="number"
                value={payout}
                onChange={(e) => setPayout(e.target.value)}
                placeholder="e.g. 1200000"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirm & Send Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
