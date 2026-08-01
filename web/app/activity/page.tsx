import { BookOpen, CheckCircle2, Copy, FileScan, RefreshCw } from "lucide-react";
import { activity } from "@/lib/opsData";

const icons={cards:BookOpen,scan:RefreshCw,duplicate:Copy,approve:CheckCircle2,document:FileScan};
export default function ActivityPage(){
  return <main className="shell"><section className="page-head"><div><h1>Activity</h1><p>A chronological record of card, document, and administrator events</p></div><div className="head-actions"><select className="select"><option>All activity</option><option>Cards</option><option>Documents</option><option>Administration</option></select></div></section>
  {activity.map(group=><section className="activity-day" key={group.date}><h2>{group.date}</h2><div className="panel">{group.items.map(([type,title,source,time])=>{const Icon=icons[type as keyof typeof icons];return <article className="feed-item" key={title}><span className="feed-icon"><Icon/></span><div><p>{title}</p><small>{source}</small></div><time>{time}</time></article>})}</div></section>)}</main>
}
