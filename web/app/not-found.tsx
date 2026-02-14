import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        The page you’re looking for doesn’t exist or the link is wrong.
      </p>
      <Link
        href="/"
        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-100"
      >
        Back to home
      </Link>
    </div>
  );
}
