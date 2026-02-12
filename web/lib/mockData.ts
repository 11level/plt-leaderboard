import { slugify } from "./slugs";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  slug: string;
  cardsCut: number;
};

export type RecentCard = {
  id: string;
  title: string;
  cutAt: string; // ISO date
  snippet?: string;
};

export type Profile = {
  name: string;
  slug: string;
  cardsCut: number;
  rank: number;
  recentCards: RecentCard[];
};

// Placeholder data – replace with data from your Google Drive scanner
const RAW_LEADERBOARD: Omit<LeaderboardEntry, "slug">[] = [
  { rank: 1, name: "ilovebeabadoobee", cardsCut: 1495 },
  { rank: 2, name: "ezpeasy", cardsCut: 38 },
  { rank: 3, name: "riyal or fake", cardsCut: 31 },
  { rank: 4, name: "weij", cardsCut: 24 },
  { rank: 5, name: "adi", cardsCut: 19 },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = RAW_LEADERBOARD.map(
  (e) => ({ ...e, slug: slugify(e.name) })
);

// Mock recently cut cards per profile (keyed by slug)
const MOCK_RECENT_CARDS: Record<string, RecentCard[]> = {
  ilovebeabadoobee: [
    { id: "1", title: "Economic collapse – inflation", cutAt: "2025-02-10T14:00:00Z", snippet: "Inflation undermines stability..." },
    { id: "2", title: "Healthcare access – solvency", cutAt: "2025-02-09T11:30:00Z", snippet: "Medicare solvency is key..." },
    { id: "3", title: "Climate – renewable jobs", cutAt: "2025-02-08T09:15:00Z", snippet: "Renewable sector job growth..." },
  ],
  ezpeasy: [
    { id: "4", title: "Trade – tariffs impact", cutAt: "2025-02-10T10:00:00Z" },
    { id: "5", title: "Immigration – border security", cutAt: "2025-02-07T16:00:00Z" },
  ],
  "riyal-or-fake": [
    { id: "6", title: "Nuclear proliferation", cutAt: "2025-02-09T12:00:00Z", snippet: "Proliferation risks increase..." },
  ],
  weij: [
    { id: "7", title: "Tech regulation", cutAt: "2025-02-08T14:00:00Z" },
  ],
  adi: [],
};

export function getProfileBySlug(slug: string): Profile | null {
  const entry = MOCK_LEADERBOARD.find((e) => e.slug === slug);
  if (!entry) return null;
  const recentCards = MOCK_RECENT_CARDS[slug] ?? [];
  return {
    name: entry.name,
    slug: entry.slug,
    cardsCut: entry.cardsCut,
    rank: entry.rank,
    recentCards,
  };
}
