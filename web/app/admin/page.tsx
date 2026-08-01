import { AlertTriangle, Copy, Tags, Users } from "lucide-react";
const reviews=[
  ["High","Large batch addition","Adi Patel","48 cards","42 cards were added in one document revision.","Trade Neg — Links","Jul 30, 3:42 PM"],
  ["Medium","Near-duplicate group","Maya Lin","4 cards","87% of the new cards closely match existing evidence.","Trade Neg — Supply Chains","Jul 30, 1:18 PM"],
  ["Medium","Unknown cutter tag","Unassigned","6 cards","The tag // [jliu] is not assigned to a team member.","Framework Backfiles","Jul 29, 6:03 PM"],
];
export default function ReviewPage(){
 return <main className="shell"><section className="page-head"><div><h1>Review Queue</h1><p>Resolve uncertain cards with context and neutral evidence</p></div></section>
 <section className="metrics"><article className="metric"><div className="metric-head"><span>Pending reviews</span><AlertTriangle/></div><strong>7</strong><small>Across 3 categories</small></article><article className="metric"><div className="metric-head"><span>High-risk items</span><AlertTriangle/></div><strong>1</strong><small>Temporarily excluded</small></article><article className="metric"><div className="metric-head"><span>Unknown cutter tags</span><Tags/></div><strong>2</strong><small>6 affected cards</small></article><article className="metric"><div className="metric-head"><span>Near-duplicate groups</span><Copy/></div><strong>4</strong><small>Awaiting comparison</small></article></section>
 <div className="review-list">{reviews.map(item=><article className="panel review-card" key={item[1]}><div className="review-risk"><span className={`badge ${item[0]==="High"?"error":"review"}`}><i/>{item[0]} priority</span><small>{item[6]}</small></div><div className="review-main"><span className="feed-icon"><Users/></span><div><h2>{item[1]}</h2><p>{item[4]}</p><small>{item[2]} · {item[3]} · {item[5]}</small></div></div><div className="review-actions"><button className="button">Review individually</button><button className="button primary">Approve all</button></div></article>)}</div></main>
}
