import { slugify } from "./slugs";

export type ReviewStatus = "Clear" | "Monitor" | "Review";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  slug: string;
  initials: string;
  verified: number;
  raw: number;
  duplicates: number;
  periodAdded: number;
  lastAdded: string;
  reviewStatus: ReviewStatus;
  accent: string;
};

export type RecentCard = {
  id: string;
  title: string;
  cutAt: string;
  snippet: string;
  source: string;
  status: "Counted" | "Duplicate" | "Flagged";
  reason: string;
};

export type Profile = LeaderboardEntry & { recentCards: RecentCard[] };

const RAW_LEADERBOARD: Omit<LeaderboardEntry, "rank" | "slug">[] = [
  { name: "Pingkang Qian", initials: "PQ", verified: 184, raw: 201, duplicates: 17, periodAdded: 42, lastAdded: "12 min ago", reviewStatus: "Clear", accent: "#ef4444" },
  { name: "Tony Dong", initials: "TD", verified: 161, raw: 176, duplicates: 15, periodAdded: 36, lastAdded: "1 hr ago", reviewStatus: "Clear", accent: "#2563eb" },
  { name: "Emily Zhang", initials: "EZ", verified: 137, raw: 159, duplicates: 22, periodAdded: 31, lastAdded: "3 hrs ago", reviewStatus: "Monitor", accent: "#d97706" },
  { name: "Weij Chen", initials: "WC", verified: 119, raw: 128, duplicates: 9, periodAdded: 27, lastAdded: "Yesterday", reviewStatus: "Clear", accent: "#059669" },
  { name: "Adi Patel", initials: "AP", verified: 93, raw: 112, duplicates: 19, periodAdded: 18, lastAdded: "Yesterday", reviewStatus: "Review", accent: "#7c3aed" },
  { name: "Maya Lin", initials: "ML", verified: 76, raw: 82, duplicates: 6, periodAdded: 14, lastAdded: "2 days ago", reviewStatus: "Clear", accent: "#db2777" },
];

export const LEADERBOARD: LeaderboardEntry[] = RAW_LEADERBOARD.map((entry, index) => ({
  ...entry,
  rank: index + 1,
  slug: slugify(entry.name),
}));

const CARDS: Record<string, RecentCard[]> = {
  "pingkang-qian": [
    { id: "c-1042", title: "Grid modernization prevents capacity shortfalls", cutAt: "2026-07-30T17:48:00Z", snippet: "Regional transmission investment is the binding constraint on clean generation deployment.", source: "Energy Aff — Grid", status: "Counted", reason: "Unique evidence; strict tag matched; 187 words." },
    { id: "c-1038", title: "Industrial policy strengthens supply chain resilience", cutAt: "2026-07-30T16:21:00Z", snippet: "Targeted public investment reduces exposure to concentrated critical mineral supply.", source: "Econ Core — Resilience", status: "Counted", reason: "No exact or near-duplicate found." },
    { id: "c-1011", title: "Permitting reform accelerates transmission", cutAt: "2026-07-29T20:02:00Z", snippet: "Interregional projects face approval delays across multiple jurisdictions.", source: "Energy Aff — Grid", status: "Duplicate", reason: "96% similar to card c-884; first observed copy retained." },
  ],
};

export function getProfileBySlug(slug: string): Profile | null {
  const entry = LEADERBOARD.find((candidate) => candidate.slug === slug);
  return entry ? { ...entry, recentCards: CARDS[slug] ?? [] } : null;
}
