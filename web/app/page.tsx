import { CopyCheck, RefreshCw, TrendingUp, UserRoundCheck, Zap } from "lucide-react";
import { LeaderboardTable } from "@/app/components/LeaderboardTable";
import { LEADERBOARD } from "@/lib/mockData";

export default function Home() {
  const verified=LEADERBOARD.reduce((sum,item)=>sum+item.verified,0);
  const weekly=LEADERBOARD.reduce((sum,item)=>sum+item.periodAdded,0);
  const duplicates=LEADERBOARD.reduce((sum,item)=>sum+item.duplicates,0);
  return <main className="shell">
    <section className="page-head"><div><h1>Prep Leaderboard</h1><p>Track verified debate cards across your team</p></div><div className="head-actions"><label className="field-label">DATE RANGE<select className="select"><option>This week</option><option>This month</option><option>All time</option></select></label><label className="field-label">PREP CYCLE<select className="select"><option>2026 Nationals</option><option>Spring Invitational</option></select></label><button className="button"><RefreshCw/> Sync Drive</button></div></section>
    <section className="metrics" aria-label="Leaderboard summary">
      <article className="metric"><div className="metric-head"><span>Verified cards</span><CopyCheck/></div><strong>{verified}</strong><small><b>↑ 12.4%</b> from last week</small></article>
      <article className="metric"><div className="metric-head"><span>Cards added this week</span><TrendingUp/></div><strong>{weekly}</strong><small>42 more than last week</small></article>
      <article className="metric"><div className="metric-head"><span>Active contributors</span><UserRoundCheck/></div><strong>{LEADERBOARD.length}</strong><small>All members active</small></article>
      <article className="metric"><div className="metric-head"><span>Duplicates removed</span><Zap/></div><strong>{duplicates}</strong><small>11.2% of raw cards</small></article>
    </section>
    <div className="sync-banner"><RefreshCw/><div><p>Drive sync completed successfully</p><small>218 documents checked · 14 new cards · 6 duplicates removed</small></div><span className="badge verified"><i/> Up to date</span></div>
    <LeaderboardTable entries={LEADERBOARD}/>
  </main>;
}
