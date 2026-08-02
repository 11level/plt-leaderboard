import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getProfileBySlug } from "@/lib/mockData";
import { cards } from "@/lib/opsData";

export default async function ProfilePage({params}:{params:Promise<{slug:string}>}) {
  const profile=getProfileBySlug((await params).slug); if(!profile) notFound();
  return <main className="shell"><Link className="button" href="/">← Leaderboard</Link>
    <section className="profile-hero" style={{marginTop:18}}><span className="avatar" style={{background:profile.accent,color:"#fff"}}>{profile.initials}</span><div className="profile-identity"><h1>{profile.name}</h1><p>{`// [${profile.slug.split("-")[0]}]`} · Debater · Last active {profile.lastAdded}</p></div><div className="profile-stats"><div><span>VERIFIED CARDS</span><strong>{profile.verified}</strong></div><div><span>THIS WEEK</span><strong className="positive">+{profile.periodAdded}</strong></div><div><span>DUPLICATE RATE</span><strong>{Math.round(profile.duplicates/profile.raw*100)}%</strong></div><div><span>TEAM RANK</span><strong>#{profile.rank}</strong></div></div></section>
    <section className="panel" style={{marginBottom:20}}><div className="panel-head"><div><h2>Card production</h2><p>Verified cards over the last eight weeks</p></div></div><div className="bar-chart" aria-label="Text summary: card production rose from 11 to 42 cards over eight weeks">{[11,18,16,24,21,29,34,42].map((value,index)=><div className="trend-column" key={index}><i style={{height:`${value*2}px`}}/><small>W{index+1}</small></div>)}</div></section>
    <div className="tabs"><button className="active">Counted cards</button><button>Duplicates</button><button>Flagged activity</button><button>Activity history</button></div>
    <section className="panel">{cards.filter(card=>card.cutter===profile.name || profile.rank>3).slice(0,4).map(card=><article className="card-list-row" key={card.id}><div><h3>{card.title}</h3><p>{card.citation} · First observed {card.date}</p></div><div><small>SOURCE DOCUMENT</small><p>{card.document}</p></div><span className={`badge ${card.status==="Verified"?"verified":"near"}`}><i/>{card.status}</span><Link href="#" aria-label={`Open ${card.title} in Google Drive`}><ExternalLink/> Drive</Link></article>)}</section>
  </main>;
}
