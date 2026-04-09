import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomOrgNode } from './CustomOrgNode';
import dagre from 'dagre';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Expand, Maximize2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Calendar, Building, Briefcase } from 'lucide-react';

const nodeTypes = {
  custom: CustomOrgNode,
};

// Dagre layout configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 80;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'TB' ? 'top' : 'left';
    node.sourcePosition = direction === 'TB' ? 'bottom' : 'right';

    // We are shifting the dagre node position (which is center-based) to top-left
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

interface OrgChartProProps {
  employees: any[];
}

function OrgChartInner({ employees }: OrgChartProProps) {
  const { setCenter, fitView } = useReactFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Build departments list
  const departments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach(emp => {
      if (emp.departments?.name) depts.add(emp.departments.name);
    });
    return Array.from(depts);
  }, [employees]);

  // Process data for React Flow
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];

    employees.forEach((emp) => {
      nodes.push({
        id: emp.id,
        type: 'custom',
        data: {
          first_name: emp.first_name,
          last_name: emp.last_name,
          avatar_url: emp.avatar_url,
          designation: emp.designations?.title || 'Team Member',
          department: emp.departments?.name || '',
          status: emp.status,
          is_root: !emp.reporting_manager_id,
        },
      });

      if (emp.reporting_manager_id) {
        edges.push({
          id: `e-${emp.reporting_manager_id}-${emp.id}`,
          source: emp.reporting_manager_id,
          target: emp.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, opacity: 0.4 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: 'hsl(var(--primary))',
          },
        });
      }
    });

    return getLayoutedElements(nodes, edges);
  }, [employees]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Search and Filter logic
  useEffect(() => {
    let filteredNodes = initialNodes;
    
    if (selectedDept !== 'all') {
      // Find matching nodes and their ancestors/descendants to keep context
      // For simplicity in Pro version, we just filter the nodes but keep edges valid if they exist
      filteredNodes = initialNodes.filter(n => n.data.department === selectedDept || n.data.is_root);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.map(n => ({
        ...n,
        selected: n.data.first_name.toLowerCase().includes(searchLower) || 
                   n.data.last_name.toLowerCase().includes(searchLower)
      }));

      // Auto-center on first match
      const match = filteredNodes.find(n => n.selected);
      if (match) {
        setCenter(match.position.x + nodeWidth / 2, match.position.y + nodeHeight / 2, { zoom: 1.2, duration: 800 });
      }
    } else {
      filteredNodes = filteredNodes.map(n => ({ ...n, selected: false }));
    }

    setNodes(filteredNodes);
  }, [searchTerm, selectedDept, initialNodes, setNodes, setCenter]);

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    const emp = employees.find(e => e.id === node.id);
    if (emp) setSelectedEmployee(emp);
  }, [employees]);

  return (
    <div className="h-[700px] w-full relative bg-background/50 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable 
          className="!bg-background/80 !border-border/50 rounded-lg !bottom-4 !right-4"
          maskColor="rgba(var(--primary), 0.05)"
        />
        <Controls className="!bg-background/80 !border-border/50 !rounded-lg !shadow-lg" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--primary) / 0.1)" />
        
        <Panel position="top-left" className="bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-2xl flex flex-col gap-4 min-w-[300px] m-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Org Chart Pro</h3>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Find employee..." 
                className="pl-9 h-10 border-border/50 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter by Department
              </label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="border-border/50 h-10 bg-background/50">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2 pb-1">
              <Button variant="outline" size="sm" className="flex-1 h-9 gap-2 text-xs border-border/50" onClick={() => fitView({ duration: 800 })}>
                <Maximize2 className="w-3.5 h-3.5" /> Fit View
              </Button>
            </div>
          </div>
        </Panel>

        <Panel position="bottom-left" className="m-4">
          <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-[10px] text-muted-foreground font-medium flex items-center gap-2 group hover:border-primary/50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live Hierarchy · {nodes.length} nodes
          </div>
        </Panel>
      </ReactFlow>

      {/* Quick View Sheet */}
      <Sheet open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <SheetContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-border/50">
          <SheetHeader className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl shadow-primary/10">
                <AvatarImage src={selectedEmployee?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {selectedEmployee?.first_name?.[0]}{selectedEmployee?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <SheetTitle className="text-2xl font-bold">
                  {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                </SheetTitle>
                <SheetDescription className="text-primary font-medium mt-1">
                  {selectedEmployee?.designations?.title || 'Team Member'}
                </SheetDescription>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                  {selectedEmployee?.departments?.name}
                </Badge>
                <Badge className={selectedEmployee?.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'} variant="outline">
                  {selectedEmployee?.status || 'active'}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 transition-colors hover:bg-card">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Work Email</p>
                  <p className="text-sm font-medium">{selectedEmployee?.work_email || 'Not shared'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 transition-colors hover:bg-card">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Phone</p>
                  <p className="text-sm font-medium">{selectedEmployee?.phone || 'Not shared'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 transition-colors hover:bg-card">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Employment Type</p>
                  <p className="text-sm font-medium capitalize">{selectedEmployee?.employment_type?.replace('_', ' ') || 'Full Time'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 transition-colors hover:bg-card">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Joined</p>
                  <p className="text-sm font-medium">{selectedEmployee?.date_of_joining ? new Date(selectedEmployee.date_of_joining).toLocaleDateString() : '—'}</p>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 gap-2 mt-4 shadow-lg shadow-primary/20" onClick={() => window.location.href = `/employees/${selectedEmployee?.id}`}>
              View Full Profile
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function OrgChartPro(props: OrgChartProProps) {
  return (
    <ReactFlowProvider>
      <OrgChartInner {...props} />
    </ReactFlowProvider>
  );
}
