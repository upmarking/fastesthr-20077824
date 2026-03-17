import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Building, Bell, Shield, KeyIcon, Users, Mail, Settings2, Loader2, Send } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Settings() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  const { data: company, isLoading } = useQuery({
    queryKey: ['my-company', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return null;
      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .maybeSingle();
      return data;
    },
    enabled: !!profile?.company_id,
  });

  const [form, setForm] = useState({ 
    name: '', timezone: '', currency: '', country: '',
    smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', smtp_from_email: '', smtp_from_name: '',
    offer_sequence_prefix: '', offer_sequence_current: '0'
  });

  useEffect(() => {
    if (company) {
      const c = company as any;
      setForm({
        name: c.name || '',
        timezone: c.timezone || 'UTC',
        currency: c.currency || 'USD',
        country: c.country || '',
        smtp_host: c.smtp_host || '',
        smtp_port: c.smtp_port?.toString() || '',
        smtp_user: c.smtp_user || '',
        smtp_pass: c.smtp_pass || '',
        smtp_from_email: c.smtp_from_email || '',
        smtp_from_name: c.smtp_from_name || '',
        offer_sequence_prefix: c.offer_sequence_prefix || 'OFFER-',
        offer_sequence_current: c.offer_sequence_current?.toString() || '0',
      });
    }
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("Company ID is missing.");
      const { error } = await supabase
        .from('companies')
        .update({
          name: form.name,
          timezone: form.timezone,
          currency: form.currency,
          country: form.country,
          smtp_host: form.smtp_host || null,
          smtp_port: form.smtp_port ? parseInt(form.smtp_port) : null,
          smtp_user: form.smtp_user || null,
          smtp_pass: form.smtp_pass || null,
          smtp_from_email: form.smtp_from_email || null,
          smtp_from_name: form.smtp_from_name || null,
          offer_sequence_prefix: form.offer_sequence_prefix || null,
          offer_sequence_current: form.offer_sequence_current ? parseInt(form.offer_sequence_current) : 0,
        })
        .eq('id', profile.company_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success('Settings saved successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save settings');
    },
  });

  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleTestSmtp = async () => {
    if (!form.smtp_host || !form.smtp_user || !form.smtp_pass) {
      toast.error('Please fill in SMTP Host, User, and Password first');
      return;
    }

    const email = prompt("Enter an email address to send a test message to:", (profile as any)?.email || "");
    if (!email) return;

    setIsTestingSmtp(true);
    const toastId = toast.loading('Sending test email...');

    try {
      const { data, error } = await supabase.functions.invoke('test-smtp', {
        body: {
          smtp_host: form.smtp_host,
          smtp_port: form.smtp_port,
          smtp_user: form.smtp_user,
          smtp_pass: form.smtp_pass,
          smtp_from_email: form.smtp_from_email,
          smtp_from_name: form.smtp_from_name,
          test_email: email
        }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success('Test email sent successfully! Please check your inbox.', { id: toastId });
    } catch (err: any) {
      console.error('SMTP Test Error:', err);
      // Try to extract a more descriptive message if it's a FunctionsHttpError
      let errorMessage = err.message || 'Unknown error';
      if (err.context && typeof err.context.json === 'function') {
        try {
          const body = await err.context.json();
          if (body.error) {
            errorMessage = body.error;
            if (body.code) errorMessage += ` [${body.code}]`;
            if (body.response) errorMessage += `: ${body.response}`;
          }
        } catch (e) { /* ignore */ }
      }
      toast.error(`SMTP Test Failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const menuItems = [
    { id: 'general', label: 'General Info', icon: Building },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'schedule', label: 'Work Schedule', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email_docs', label: 'Email & Documents', icon: Mail },
    { id: 'security', label: 'Security & SSO', icon: KeyIcon },
    { id: 'integrations', label: 'Integrations', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
          <p className="text-muted-foreground mt-1">Configuration & preferences</p>
        </div>
        <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 items-start">
        <Card className="overflow-hidden col-span-1">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base">Menu</CardTitle>
          </CardHeader>
          <div className="flex flex-col py-2">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary/10 border-l-2 border-l-primary text-primary'
                    : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground border-l-2 border-l-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              {activeTab === 'general' && <><Building className="w-5 h-5" /> General Information</>}
              {activeTab === 'email_docs' && <><Mail className="w-5 h-5" /> Email & Documents Settings</>}
              {activeTab !== 'general' && activeTab !== 'email_docs' && <><Settings2 className="w-5 h-5" /> {menuItems.find(m => m.id === activeTab)?.label}</>}
            </CardTitle>
            <CardDescription>
              {activeTab === 'general' && "Update your company details and global settings."}
              {activeTab === 'email_docs' && "Configure SMTP for outgoing emails and format prefixes for generated documents."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : activeTab === 'general' ? (
              <>
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Company Name</label>
                    <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="bg-background/50 border-border/50 text-sm h-10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Country</label>
                    <Input value={form.country} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} className="bg-background/50 border-border/50 text-sm h-10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Default Timezone</label>
                    <select
                      value={form.timezone}
                      onChange={(e) => setForm(f => ({ ...f, timezone: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Primary Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-lg bg-background border-2 border-dashed border-primary/40 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary transition-colors cursor-pointer">
                      {company?.logo_url ? (
                        <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm mb-1">Upload a new logo</p>
                      <p className="text-xs text-muted-foreground mb-3">Max file size 2MB. Recommended 256x256 px.</p>
                      <Button variant="outline" size="sm" className="text-xs h-8">Choose File</Button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === 'email_docs' ? (
              <div className="space-y-8 pt-4">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                    <h3 className="text-base font-semibold">SMTP Server Identity Config</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleTestSmtp} 
                      disabled={isTestingSmtp}
                      className="h-8 gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-primary"
                    >
                      {isTestingSmtp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {isTestingSmtp ? 'Testing...' : 'Test Connection'}
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Sender Email Address</label>
                      <Input type="email" placeholder="hr@company.com" value={form.smtp_from_email} onChange={(e) => setForm(f => ({ ...f, smtp_from_email: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Sender Name</label>
                      <Input placeholder="Company HR Department" value={form.smtp_from_name} onChange={(e) => setForm(f => ({ ...f, smtp_from_name: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">SMTP Host</label>
                      <Input placeholder="smtp.mailgun.org" value={form.smtp_host} onChange={(e) => setForm(f => ({ ...f, smtp_host: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">SMTP Port</label>
                      <Input type="number" placeholder="587" value={form.smtp_port} onChange={(e) => setForm(f => ({ ...f, smtp_port: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">SMTP Username</label>
                      <Input placeholder="postmaster@company.com" value={form.smtp_user} onChange={(e) => setForm(f => ({ ...f, smtp_user: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">SMTP Password</label>
                      <Input type="password" placeholder="••••••••" value={form.smtp_pass} onChange={(e) => setForm(f => ({ ...f, smtp_pass: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-4 border-b border-border/50 pb-2">Document Sequencing</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Offer Letter Prefix</label>
                      <Input placeholder="OFFER-" value={form.offer_sequence_prefix} onChange={(e) => setForm(f => ({ ...f, offer_sequence_prefix: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Current Sequence Number</label>
                      <Input type="number" placeholder="0" value={form.offer_sequence_current} onChange={(e) => setForm(f => ({ ...f, offer_sequence_current: e.target.value }))} className="bg-background/50 border-border/50 h-10" />
                      <p className="text-[10px] text-muted-foreground">The system will assign `{form.offer_sequence_prefix || 'OFFER-'}${parseInt(form.offer_sequence_current || '0') + 1}` to the next generated offer letter.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground italic text-sm">
                Tab content for {menuItems.find(m => m.id === activeTab)?.label} coming soon.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
