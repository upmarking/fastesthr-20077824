import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  BarChart3, TrendingUp, Users, Target, Award, Loader2,
  ArrowUpRight, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/auth-store';

const STAGES = ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired'];

const STAGE_COLORS: Record<string, string> = {
  applied: 'bg-blue-500',
  screening: 'bg-yellow-500',
  interview: 'bg-purple-500',
  assessment: 'bg-indigo-500',
  offer: 'bg-orange-500',
  hired: 'bg-green-500',
};

export function RecruitmentAnalytics() {
  const { profile } = useAuthStore();
  const isAdmin = ['company_admin', 'super_admin'].includes(profile?.platform_role || '');
  const isManager = profile?.platform_role === 'hr_manager';

  // Fetch team members visible to current user
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['analytics-team', profile?.company_id, profile?.id],
    queryFn: async () => {
      let query = (supabase as any)
        .from('profiles')
        .select('id, full_name, platform_role')
        .eq('company_id', profile!.company_id!)
        .in('platform_role', ['recruiter', 'hr_manager'])
        .eq('is_active', true)
        .order('full_name');

      if (isManager) {
        query = query.eq('manager_id', profile!.id);
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!profile?.company_id && (isAdmin || isManager),
  });

  // Fetch all candidates in scope
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['analytics-candidates', profile?.company_id, profile?.id],
    queryFn: async () => {
      let query = (supabase as any)
        .from('candidates')
        .select('id, stage, score, assigned_to, created_at, job_id')
        .eq('company_id', profile!.company_id!);

      if (profile?.platform_role === 'recruiter') {
        query = query.eq('assigned_to', profile.id);
      }
      if (isManager) {
        const { data: teamIds } = await (supabase as any)
          .from('profiles')
          .select('id')
          .eq('manager_id', profile!.id);
        const ids = [profile!.id, ...(teamIds?.map((t: any) => t.id) || [])];
        query = query.in('assigned_to', ids);
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  const { funnelData, maxFunnelCount, totalApplied, totalHired, conversionRate, avgScore, recruiterStats } = useMemo(() => {
    // 1. Single pass over candidates to compute funnel counts, total score, and recruiter buckets
    const countsByStage: Record<string, number> = {};
    STAGES.forEach(s => countsByStage[s] = 0);

    let scoredCount = 0;
    let totalScoreSum = 0;

    const recruitersMap: Record<string, { total: number; hired: number; scoreSum: number; scoredCount: number; byStage: Record<string, number> }> = {};

    const availableMembers = [...teamMembers, ...(profile?.platform_role === 'recruiter' ? [{ id: profile.id, full_name: 'You', platform_role: 'recruiter' }] : [])];
    availableMembers.forEach(m => {
      recruitersMap[m.id] = { total: 0, hired: 0, scoreSum: 0, scoredCount: 0, byStage: STAGES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {}) };
    });

    candidates.forEach((c: any) => {
      // Funnel
      if (countsByStage[c.stage] !== undefined) {
        countsByStage[c.stage]++;
      }

      // Scores
      if (c.score !== null) {
        scoredCount++;
        totalScoreSum += c.score;
      }

      // Recruiter stats
      const rStats = recruitersMap[c.assigned_to];
      if (rStats) {
        rStats.total++;
        if (c.stage === 'hired') rStats.hired++;
        if (rStats.byStage[c.stage] !== undefined) rStats.byStage[c.stage]++;
        if (c.score !== null) {
          rStats.scoredCount++;
          rStats.scoreSum += c.score;
        }
      }
    });

    const funnelData = STAGES.map((stage) => ({
      stage,
      count: countsByStage[stage] || 0,
    }));
    const maxFunnelCount = Math.max(...funnelData.map((f) => f.count), 1);
    const totalApplied = candidates.length;
    const totalHired = countsByStage['hired'] || 0;
    const conversionRate = totalApplied > 0 ? ((totalHired / totalApplied) * 100).toFixed(1) : '0';
    const avgScore = scoredCount > 0 ? (totalScoreSum / scoredCount).toFixed(1) : '—';

    const recruiterStats = availableMembers.map((member: any) => {
      const stats = recruitersMap[member.id];
      const conversion = stats.total > 0 ? ((stats.hired / stats.total) * 100).toFixed(0) : '0';
      const avgMemberScore = stats.scoredCount > 0 ? (stats.scoreSum / stats.scoredCount).toFixed(1) : null;

      return {
        ...member,
        total: stats.total,
        hired: stats.hired,
        conversion,
        avgScore: avgMemberScore,
        byStage: stats.byStage,
      };
    }).sort((a, b) => b.total - a.total);

    return { funnelData, maxFunnelCount, totalApplied, totalHired, conversionRate, avgScore, recruiterStats };
  }, [candidates, teamMembers, profile?.id, profile?.platform_role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Leads</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalApplied}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-green-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Hired</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalHired}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Conversion</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{conversionRate}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Score</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgScore}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Funnel */}
        <Card className="bg-background/50 border-border/50">
          <CardHeader className="pb-3 border-b border-border/10">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Pipeline Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {funnelData.map(({ stage, count }) => (
              <div key={stage} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{stage}</span>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${STAGE_COLORS[stage] || 'bg-primary'}`}
                    style={{ width: `${(count / maxFunnelCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {totalApplied === 0 && (
              <p className="text-center text-sm text-muted-foreground/50 py-4">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Per-Recruiter Breakdown */}
        {(isAdmin || isManager) && recruiterStats.length > 0 && (
          <Card className="bg-background/50 border-border/50">
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Recruiter Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {recruiterStats.map((r) => (
                <div key={r.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
                        {getInitials(r.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{r.full_name}</p>
                        <div className="flex items-center gap-2">
                          {r.avgScore && (
                            <span className="text-[11px] text-amber-400 flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400/30" />
                              {r.avgScore}
                            </span>
                          )}
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {r.conversion}% hired
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {STAGES.map((s) => (
                          <div
                            key={s}
                            className={`h-1.5 rounded-full ${STAGE_COLORS[s] || 'bg-primary'} transition-all`}
                            style={{ width: r.total > 0 ? `${(r.byStage[s] / r.total) * 100}%` : '0%', minWidth: r.byStage[s] > 0 ? '4px' : '0' }}
                            title={`${s}: ${r.byStage[s]}`}
                          />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">{r.total} total</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {recruiterStats.length === 0 && (
                <p className="text-center text-sm text-muted-foreground/50 py-4">No recruiters in team yet</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
