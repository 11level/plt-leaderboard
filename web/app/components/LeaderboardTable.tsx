import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/mockData";

function getRowStyles(rank: number, index: number): string {
  const border = "border-b border-zinc-100 dark:border-zinc-800";
  if (rank === 1)
    return `${border} border-l-4 border-l-[var(--rank-1)] bg-[var(--podium-1-bg)]`;
  if (rank === 2)
    return `${border} border-l-4 border-l-[var(--rank-2)] bg-[var(--podium-2-bg)]`;
  if (rank === 3)
    return `${border} border-l-4 border-l-[var(--rank-3)] bg-[var(--podium-3-bg)]`;
  return index % 2 === 0
    ? `${border} bg-white dark:bg-transparent`
    : `${border} bg-zinc-50/50 dark:bg-zinc-900/30`;
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80">
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
            <tr key={entry.rank} className={getRowStyles(entry.rank, i)}>
              <td className="px-6 py-4 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                #{entry.rank}
              </td>
              <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                <Link
                  href={`/profile/${entry.slug}`}
                  className="rounded py-0.5 font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-200"
                >
                  {entry.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-right font-mono text-sm text-zinc-700 dark:text-zinc-300">
                {entry.cardsCut.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
