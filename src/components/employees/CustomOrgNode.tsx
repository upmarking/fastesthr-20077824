import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface OrgNodeData {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  designation: string;
  department: string;
  is_root?: boolean;
  status?: string;
}

export const CustomOrgNode = memo(({ data, selected }: { data: OrgNodeData; selected?: boolean }) => {
  const isRoot = data.is_root;
  
  return (
    <div className={cn(
      "relative px-4 py-3 rounded-xl min-w-[200px] transition-all duration-300",
      "glass-card border border-white/10 shadow-lg",
      selected && "ring-2 ring-primary border-primary/50 scale-105 shadow-primary/20",
      isRoot ? "bg-primary/10 border-primary/30" : "bg-card/40"
    )}>
      {/* Connector Handles */}
      <Handle type="target" position={Position.Top} className="!bg-primary/50 !border-none !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary/50 !border-none !w-2 !h-2" />

      <div className="flex items-center gap-3">
        <Avatar className={cn(
          "border-2 transition-transform",
          isRoot ? "h-12 w-12 border-primary/50" : "h-10 w-10 border-white/10",
          selected && "scale-110"
        )}>
          <AvatarImage src={data.avatar_url || ''} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {data.first_name[0]}{data.last_name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden">
          <p className={cn(
            "font-semibold truncate leading-tight",
            isRoot ? "text-primary text-base" : "text-sm text-foreground"
          )}>
            {data.first_name} {data.last_name}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate uppercase tracking-wider font-medium">
            {data.designation}
          </p>
          {data.department && (
            <Badge variant="outline" className="mt-1.5 text-[8px] h-4 border-white/10 bg-white/5 backdrop-blur-sm text-muted-foreground/80 font-normal">
              {data.department}
            </Badge>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {data.status && data.status !== 'active' && (
        <div className={cn(
          "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-background",
          data.status === 'on_leave' ? "bg-info" : "bg-muted"
        )} />
      )}
    </div>
  );
});

CustomOrgNode.displayName = 'CustomOrgNode';
