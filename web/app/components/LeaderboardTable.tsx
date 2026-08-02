import Link from "next/link";
import { Search } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/mockData";

export function LeaderboardTable({entries}:{entries:LeaderboardEntry[]}) {
  return <section className="panel">
    <div className="panel-head"><div><h2>Team leaderboard</h2><p>Ranked by verified unique cards</p></div><div className="panel-tools"><label className="input-wrap"><Search/><input aria-label="Search debaters" placeholder="Search debaters..."/></label><select className="select" aria-label="Filter status"><option>All statuses</option><option>Verified</option><option>Review needed</option></select><select className="select" aria-label="Sort leaderboard"><option>Verified cards</option><option>This week</option><option>Last activity</option></select></div></div>
    <div className="table-scroll"><table><thead><tr><th>RANK</th><th>DEBATER</th><th>VERIFIED CARDS</th><th>THIS WEEK</th><th>RAW CARDS</th><th>DUPLICATES</th><th>LAST ACTIVITY</th><th>STATUS</th></tr></thead>
    <tbody>{entries.map(entry=><tr key={entry.slug}><td><span className={`rank rank-${entry.rank}`}>{entry.rank}</span></td><td><Link className="member" href={`/profile/${entry.slug}`}><span className="avatar" style={{background:entry.accent,color:"#fff"}}>{entry.initials}</span><div><strong>{entry.name}</strong><small>{`// [${entry.slug.split("-")[0]}]`}</small></div></Link></td><td className="verified">{entry.verified}</td><td><span className="positive">+{entry.periodAdded}</span></td><td>{entry.raw}</td><td>{entry.duplicates}</td><td className="muted">{entry.lastAdded}</td><td><span className={`badge ${entry.reviewStatus==="Clear"?"verified":entry.reviewStatus==="Monitor"?"syncing":"review"}`}><i/>{entry.reviewStatus==="Clear"?"Verified":entry.reviewStatus==="Monitor"?"Syncing":"Review needed"}</span></td></tr>)}</tbody></table></div>
    <div className="pagination"><span>Showing 1–{entries.length} of {entries.length} debaters</span><div><button aria-label="Previous page">‹</button><button className="active">1</button><button aria-label="Next page">›</button></div></div>
  </section>;
}
