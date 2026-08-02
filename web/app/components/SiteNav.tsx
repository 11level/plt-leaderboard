"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Bell, BookOpen, ChevronDown, FolderOpen,
  LayoutDashboard, Menu, Search, Settings, ShieldCheck, Users, X,
} from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Leaderboard", icon: LayoutDashboard },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/cards", label: "Cards", icon: BookOpen },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/admin", label: "Review Queue", icon: ShieldCheck, count: 7 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <>
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="side-brand"><span>PL</span><div><strong>Prep Leaderboard</strong><small>Academic analytics</small></div><button onClick={()=>setOpen(false)} aria-label="Close navigation"><X/></button></div>
      <nav aria-label="Primary">{links.map(({href,label,icon:Icon,count})=><Link onClick={()=>setOpen(false)} className={pathname===href || (href!=="/" && pathname.startsWith(href)) ? "active":""} href={href} key={href}><Icon/><span>{label}</span>{count ? <b>{count}</b>:null}</Link>)}</nav>
      <div className="side-user"><span className="avatar">PQ</span><div><strong>Pingkang Qian</strong><small>Team administrator</small></div><button aria-label="Open profile menu"><ChevronDown/></button></div>
    </aside>
    {open && <button className="nav-scrim" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <header className="topbar">
      <button className="menu-button" onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu/></button>
      <button className="team-selector"><span className="team-mark">PLT</span><span>PLT Debate</span><ChevronDown/></button>
      <label className="global-search"><Search/><input aria-label="Search cards, people, and documents" placeholder="Search cards, people, documents..."/><kbd>⌘ K</kbd></label>
      <div className="top-actions"><span className="drive-pill"><i/> Drive synced</span><button aria-label="Notifications" className="top-icon"><Bell/><i/></button><span className="top-avatar">PQ</span></div>
    </header>
  </>;
}
