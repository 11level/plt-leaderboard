import { LEADERBOARD } from "@/lib/mockData";

export default function AnalyticsPage() {
  const verified = LEADERBOARD.reduce((sum, item)=>sum+item.verified,0);
  const weekly = LEADERBOARD.reduce((sum,item)=>sum+item.periodAdded,0);
  const duplicates = LEADERBOARD.reduce((sum,item)=>sum+item.duplicates,0);
  const max = Math.max(...LEADERBOARD.map(item=>item.periodAdded));
  return <main className="shell">
    <section className="page-head"><div><p className="eyebrow">TEAM INSIGHTS</p><h1>Analytics</h1><p className="subhead">Preparation trends and data quality across the selected period.</p></div></section>
    <section className="stats analytics-stats"><article><span>VERIFIED CARDS</span><strong>{verified}</strong><small>All team members</small></article><article><span>ADDED THIS PERIOD</span><strong>{weekly}</strong><small>Across {LEADERBOARD.length} members</small></article><article><span>DUPLICATES FOUND</span><strong>{duplicates}</strong><small>{Math.round(duplicates/(verified+duplicates)*100)}% of raw cards</small></article><article><span>ACTIVE MEMBERS</span><strong>{LEADERBOARD.length}</strong><small>Current prep cycle</small></article></section>
    <section className="panel chart-panel"><div className="panel-title"><div><h2>Cards added this period</h2><p>Contribution totals by member</p></div></div><div className="bar-chart">{LEADERBOARD.map(item=><div className="bar-row" key={item.slug}><span>{item.name}</span><div><i style={{width:`${item.periodAdded/max*100}%`,background:item.accent}}/></div><strong>{item.periodAdded}</strong></div>)}</div></section>
  </main>;
}
