"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navTabs = [{ href: "/", label: "Seasons" }];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/season");
  return pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 font-sans backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <nav
        className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link
          href="/"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          Home
        </Link>
        <ul className="flex items-center gap-1">
          {navTabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={
                    active
                      ? "rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
