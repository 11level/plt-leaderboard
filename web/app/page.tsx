import Link from "next/link";
import { MOCK_SEASONS } from "@/lib/mockData";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Cards cut
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Debate prep group – who’s cut the most cards.
          </p>
        </header>

        <section aria-label="Seasons">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Select a season
          </h2>
          <ul className="space-y-2">
            {MOCK_SEASONS.map((season) => (
              <li key={season.slug}>
                <Link
                  href={`/season/${season.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white px-6 py-4 font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                  {season.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Data from Google Drive. Refresh to see latest counts.
        </p>
      </main>
    </div>
  );
}
