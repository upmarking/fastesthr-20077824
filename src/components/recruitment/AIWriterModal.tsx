import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIWriterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'job_description' | 'requirements' | 'about_company';
  context: Record<string, any>;
  onAccept: (content: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  job_description: 'Job Description',
  requirements: 'Requirements',
  about_company: 'About Company',
};

export function AIWriterModal({ open, onOpenChange, type, context, onAccept }: AIWriterModalProps) {
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: { type, context },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setContent(data.content || '');
      setGenerated(true);
    } catch (err: any) {
      toast.error(err?.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = () => {
    onAccept(content);
    onOpenChange(false);
    setContent('');
    setGenerated(false);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setContent('');
      setGenerated(false);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Fastu AI — Generate {TYPE_LABELS[type]}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Context summary */}
          <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 text-sm space-y-1">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Context</p>
            {context.title && <p className="text-foreground"><span className="text-muted-foreground">Role:</span> {context.title}</p>}
            {context.department && <p className="text-foreground"><span className="text-muted-foreground">Dept:</span> {context.department}</p>}
            {context.location && <p className="text-foreground"><span className="text-muted-foreground">Location:</span> {context.location}</p>}
            {context.companyName && <p className="text-foreground"><span className="text-muted-foreground">Company:</span> {context.companyName}</p>}
          </div>

          {/* Generated content */}
          {(content || generating) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {generated && <CheckCircle className="h-4 w-4 text-green-500" />}
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {generating ? 'Generating…' : 'Generated Content'}
                </p>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                disabled={generating}
                className="text-sm bg-background/50 border-border/50 resize-y"
                placeholder="AI is writing…"
              />
              <p className="text-[11px] text-muted-foreground">You can edit the generated content before using it.</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="order-last sm:order-first">
            Cancel
          </Button>
          {!generated ? (
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? 'Generating…' : 'Generate with AI'}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleGenerate} disabled={generating} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
              <Button onClick={handleAccept} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Use This
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
