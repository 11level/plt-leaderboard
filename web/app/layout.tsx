import type { Metadata } from "next";
import { SiteNav } from "@/app/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = { title: "PLT Leaderboard", description: "Verified debate preparation, ranked." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteNav /><div className="app-content">{children}</div></body></html>;
}
