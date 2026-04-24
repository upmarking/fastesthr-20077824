import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RolePermissionsProps {
  roleId: string;
  companyId?: string | null;
}

const MODULES = [
  'Dashboard', 'Employees', 'Attendance', 'Leave', 'Payroll',
  'Performance', 'Recruitment', 'Learning', 'Help Desk',
  'Announcements', 'Reports', 'Documents', 'Settings'
];

export function RolePermissions({ roleId, companyId }: RolePermissionsProps) {
  const queryClient = useQueryClient();
  const [permissions, setPermissions] = useState<Record<string, any>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Fetch existing permissions from the database
  const { data: existingPermissions = [], isLoading } = useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role_id', roleId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!roleId,
  });

  // Initialize the local state matrix when data is fetched or role changes
  useEffect(() => {
    const permMap: Record<string, any> = {};
    
    // Initialize default false for all modules
    MODULES.forEach(module => {
      permMap[module] = {
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_approve: false,
        can_export: false,
      };
    });

    // Populate with actual DB data
    existingPermissions.forEach((p: any) => {
      if (permMap[p.module]) {
        permMap[p.module] = {
          can_view: p.can_view || false,
          can_create: p.can_create || false,
          can_edit: p.can_edit || false,
          can_delete: p.can_delete || false,
          can_approve: p.can_approve || false,
          can_export: p.can_export || false,
        };
      }
    });

    setPermissions(permMap);
    setIsDirty(false);
  }, [existingPermissions, roleId]);

  const handleToggle = (module: string, field: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [field]: checked,
      }
    }));
    setIsDirty(true);
  };

  const handleToggleRow = (module: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        can_view: checked,
        can_create: checked,
        can_edit: checked,
        can_delete: checked,
        can_approve: checked,
        can_export: checked,
      }
    }));
    setIsDirty(true);
  };

  const handleToggleColumn = (field: string, checked: boolean) => {
    setPermissions(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(mod => {
        next[mod] = { ...next[mod], [field]: checked };
      });
      return next;
    });
    setIsDirty(true);
  };

  const savePermissions = useMutation({
    mutationFn: async () => {
      // 1. Delete all existing permissions for this role first to ensure clean state
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);
      
      if (deleteError) throw deleteError;

      // 2. Filter out modules that have absolutely 0 permissions to save DB space
      const toInsert = MODULES.map(module => ({
        role_id: roleId,
        module,
        ...permissions[module]
      })).filter(p => 
        p.can_view || p.can_create || p.can_edit || 
        p.can_delete || p.can_approve || p.can_export
      );

      // 3. Insert the active permissions
      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(toInsert);
        
        if (insertError) throw insertError;
      }
      
      return true;
    },
    onSuccess: () => {
      toast.success('Permissions updated successfully');
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ['role-permissions', roleId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update permissions');
    }
  });

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center animate-pulse bg-muted/20 rounded-md"></div>;
  }

  const columns = [
    { key: 'can_view', title: 'View' },
    { key: 'can_create', title: 'Create' },
    { key: 'can_edit', title: 'Edit' },
    { key: 'can_delete', title: 'Delete' },
    { key: 'can_approve', title: 'Approve' },
    { key: 'can_export', title: 'Export' },
  ];

  const areAllInColumnChecked = (key: string) => {
    return MODULES.every(mod => permissions[mod]?.[key]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Toggle specific access levels for each module below.</span>
        </div>
        
        <Button 
          onClick={() => savePermissions.mutate()} 
          disabled={!isDirty || savePermissions.isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {savePermissions.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Module</th>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-center font-medium min-w-[90px]">
                  <div className="flex flex-col items-center gap-2">
                    <span>{col.title}</span>
                    <Checkbox 
                      checked={areAllInColumnChecked(col.key)}
                      onCheckedChange={(checked) => handleToggleColumn(col.key, checked as boolean)}
                      aria-label={`Select all ${col.title} permissions`}
                      className="h-4 w-4 border-muted-foreground/30 data-[state=checked]:bg-primary"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module) => {
              const rowPerms = permissions[module] || {};
              const isAllChecked = columns.every(col => rowPerms[col.key]);

              return (
                <tr key={module} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium flex items-center justify-between">
                    <span>{module}</span>
                    <Checkbox 
                        checked={isAllChecked}
                        onCheckedChange={(checked) => handleToggleRow(module, checked as boolean)}
                        aria-label={`Select all permissions for ${module}`}
                        className="opacity-50 hover:opacity-100"
                        title={`Select all for ${module}`}
                      />
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-center">
                      <Checkbox 
                        checked={rowPerms[col.key] || false}
                        onCheckedChange={(checked) => handleToggle(module, col.key, checked as boolean)}
                        aria-label={`Toggle ${col.title} permission for ${module}`}
                        className="mx-auto"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
