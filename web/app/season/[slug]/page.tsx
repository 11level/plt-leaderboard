import Link from "next/link";
import { notFound } from "next/navigation";
import { LeaderboardTable } from "@/app/components/LeaderboardTable";
import {
  getSeasonBySlug,
  getLeaderboardBySeason,
} from "@/lib/mockData";

type Props = { params: Promise<{ slug: string }> };

export default async function SeasonPage({ params }: Props) {
  const { slug } = await params;
  const season = getSeasonBySlug(slug);
  if (!season) notFound();

  const entries = getLeaderboardBySeason(slug);

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-400 dark:decoration-zinc-500 dark:hover:decoration-zinc-200"
          >
            ← Back to seasons
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {season.name}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Cards cut leaderboard for this season.
          </p>
        </header>

        <section aria-label="Leaderboard">
          <LeaderboardTable entries={entries} />
        </section>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Data from Google Drive. Refresh to see latest counts.
        </p>
      </main>
    </div>
  );
}
