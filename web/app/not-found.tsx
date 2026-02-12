import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4 dark:bg-zinc-950">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Profile not found
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        This person isn’t on the leaderboard or the link is wrong.
      </p>
      <Link
        href="/"
        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-100"
      >
        Back to leaderboard
      </Link>
    </div>
  );
}
