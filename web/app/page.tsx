export type LeaderboardEntry = {
  rank: number;
  name: string;
  cardsCut: number;
};

// Placeholder data – replace with data from your Google Drive scanner
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "ilovebeabadoobee", cardsCut: 1495 },
  { rank: 2, name: "ezpeasy", cardsCut: 38 },
  { rank: 3, name: "riyal or fake", cardsCut: 31 },
  { rank: 4, name: "weij", cardsCut: 24 },
  { rank: 5, name: "adi", cardsCut: 19 },
];

function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-800/50">
            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Rank
            </th>
            <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Name
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Cards cut
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={entry.rank}
              className={
                i % 2 === 0
                  ? "border-b border-zinc-100 bg-white dark:border-zinc-800/80 dark:bg-transparent"
                  : "border-b border-zinc-100 bg-zinc-50/40 dark:border-zinc-800/80 dark:bg-zinc-800/20"
              }
            >
              <td className="px-6 py-4 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                #{entry.rank}
              </td>
              <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                {entry.name}
              </td>
              <td className="px-6 py-4 text-right font-mono text-zinc-700 dark:text-zinc-300">
                {entry.cardsCut.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Cards cut leaderboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Debate prep group – who’s cut the most cards.
          </p>
        </header>

        <section aria-label="Leaderboard">
          <LeaderboardTable entries={MOCK_LEADERBOARD} />
        </section>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Data from Google Drive. Refresh to see latest counts.
        </p>
      </main>
    </div>
  );
}
