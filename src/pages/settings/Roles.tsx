import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateRoleDialog } from '@/components/settings/CreateRoleDialog';
import { RolePermissions } from '@/components/settings/RolePermissions';
import { RoleUsers } from '@/components/settings/RoleUsers';

export default function Roles() {
  const { profile } = useAuthStore();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.company_id,
  });

  // Automatically select the first role if none is selected
  if (!selectedRoleId && roles.length > 0) {
    setSelectedRoleId(roles[0].id);
  }

  const selectedRole = roles.find((r: any) => r.id === selectedRoleId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-2">
            Create custom roles and manage module-level permissions for your organization.
          </p>
        </div>
        <CreateRoleDialog companyId={profile?.company_id} />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border rounded-xl h-[400px] animate-pulse bg-muted/20"></div>
          <div className="md:col-span-3 border rounded-xl h-[400px] animate-pulse bg-muted/20"></div>
        </div>
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">No Custom Roles Defined</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Create your first custom role to start assigning granular permissions to your team members.
          </p>
          <div className="mt-6">
            <CreateRoleDialog companyId={profile?.company_id} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar: Roles List */}
          <div className="md:col-span-1 space-y-4">
            <Card className="h-full border-muted/50 shadow-none">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Custom Roles</span>
                  <Badge variant="secondary" className="text-xs">{roles.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4 space-y-1">
                {roles.map((role: any) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full flex flex-col items-start px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedRoleId === role.id 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{role.name}</span>
                    {role.description && (
                      <span className="text-xs opacity-70 truncate w-full text-left mt-0.5" title={role.description}>
                        {role.description}
                      </span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Area: Tabs */}
          <div className="md:col-span-3">
            {selectedRole && (
              <Card className="border-muted/50 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {selectedRole.name}
                        {selectedRole.is_system && <Badge variant="secondary" className="text-xs font-normal">System</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1.5">
                        {selectedRole.description || 'No description provided.'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="permissions" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="permissions" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Permissions
                      </TabsTrigger>
                      <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Assigned Users
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="permissions" className="mt-0 outline-none">
                      <RolePermissions roleId={selectedRole.id} />
                    </TabsContent>
                    
                    <TabsContent value="users" className="mt-0 outline-none">
                      <RoleUsers roleId={selectedRole.id} companyId={profile?.company_id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
