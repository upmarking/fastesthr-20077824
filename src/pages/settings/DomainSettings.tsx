import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Copy, ExternalLink, RefreshCw, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BASE_DOMAIN = 'fastesthr.com';

export default function DomainSettings() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [customDomainInput, setCustomDomainInput] = useState('');

  const { data: domainStatus, isLoading } = useQuery({
    queryKey: ['domain-status', profile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('vercel-domains', {
        body: { action: 'get_status' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as {
        slug: string;
        subdomain: string;
        custom_domain: string | null;
        domain_verified: boolean;
        domain_config: any;
      };
    },
    enabled: !!profile?.company_id,
  });

  const addCustomDomain = useMutation({
    mutationFn: async (domain: string) => {
      const { data, error } = await supabase.functions.invoke('vercel-domains', {
        body: { action: 'add_custom_domain', domain },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-status'] });
      setCustomDomainInput('');
      toast.success('Custom domain added! Configure DNS records shown below.');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add domain'),
  });

  const verifyDomain = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('vercel-domains', {
        body: { action: 'verify_domain' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['domain-status'] });
      if (data.verified) {
        toast.success('Domain verified successfully!');
      } else {
        toast.info('Domain not yet verified. Please check your DNS records.');
      }
    },
    onError: (err: any) => toast.error(err.message || 'Verification failed'),
  });

  const removeDomain = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('vercel-domains', {
        body: { action: 'remove_domain' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-status'] });
      toast.success('Custom domain removed');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to remove domain'),
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const openUrl = (url: string) => {
    window.open(`https://${url}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const config = domainStatus?.domain_config;
  const records = config?.records || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Domain</h2>
          <p className="text-sm text-muted-foreground">Workspace URL & Custom Domain</p>
        </div>
      </div>

      {/* Default Workspace URL */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Default Workspace URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-background border border-border/50 rounded-lg overflow-hidden">
              <div className="flex-1 px-4 py-2.5 font-mono text-sm text-foreground">
                {domainStatus?.slug || '...'}
              </div>
              <div className="px-4 py-2.5 bg-muted/50 text-sm text-muted-foreground border-l border-border/50">
                .{BASE_DOMAIN}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => copyToClipboard(`${domainStatus?.slug}.${BASE_DOMAIN}`)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => openUrl(`${domainStatus?.slug}.${BASE_DOMAIN}`)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Custom Domain</CardTitle>
            {domainStatus?.custom_domain && (
              <Badge
                variant="outline"
                className={
                  domainStatus.domain_verified
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                }
              >
                {domainStatus.domain_verified ? (
                  <><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</>
                ) : (
                  <><AlertCircle className="w-3 h-3 mr-1" /> Pending</>
                )}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {domainStatus?.custom_domain ? (
            <>
              {/* Existing domain display */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-2.5 font-mono text-sm text-foreground">
                  {domainStatus.custom_domain}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => verifyDomain.mutate()}
                  disabled={verifyDomain.isPending}
                >
                  <RefreshCw className={`w-4 h-4 ${verifyDomain.isPending ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => openUrl(domainStatus.custom_domain!)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              {/* Remove button */}
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => removeDomain.mutate()}
                disabled={removeDomain.isPending}
              >
                {removeDomain.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Remove
              </Button>

              {/* DNS Configuration */}
              {records.length > 0 && (
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">Configuration Required:</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Host</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record: any, i: number) => (
                        <tr key={i} className="border-b border-border/20 last:border-0">
                          <td className="px-4 py-2.5">
                            <Badge variant="outline" className="text-xs font-mono">
                              {record.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                            {record.host}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                            <button
                              onClick={() => copyToClipboard(record.value)}
                              className="hover:text-primary transition-colors cursor-pointer truncate max-w-[200px] block"
                              title={record.value}
                            >
                              {record.value}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            /* Add new custom domain */
            <div className="flex items-center gap-2">
              <Input
                placeholder="yourdomain.com"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                className="font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customDomainInput.trim()) {
                    addCustomDomain.mutate(customDomainInput.trim());
                  }
                }}
              />
              <Button
                onClick={() => addCustomDomain.mutate(customDomainInput.trim())}
                disabled={!customDomainInput.trim() || addCustomDomain.isPending}
                className="shrink-0"
              >
                {addCustomDomain.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
