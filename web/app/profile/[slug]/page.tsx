import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/lib/mockData";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:decoration-zinc-300"
          >
            ← Back to leaderboard
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Rank #{profile.rank} · {profile.cardsCut.toLocaleString()} cards cut
          </p>
        </header>

        <section aria-label="Recently cut cards" className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Recently cut cards
          </h2>
          {profile.recentCards.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-6 py-8 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              No recent cards yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {profile.recentCards.map((card) => (
                <li
                  key={card.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {card.title}
                    </span>
                    <time
                      dateTime={card.cutAt}
                      className="text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      {formatDate(card.cutAt)}
                    </time>
                  </div>
                  {card.snippet && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {card.snippet}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
