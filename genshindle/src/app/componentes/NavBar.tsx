'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const items = [
  { href: '/genshin', label: 'Genshin' },
  { href: '/demon-slayer', label: 'Demon Slayer' },
  { href: '/series', label: 'Séries' },
  { href: '/filmes', label: 'Filmes' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-black/20 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <Link href="/genshin" className="text-xl font-extrabold text-[var(--title)]">GuessHub</Link>
        <nav className="ml-auto flex items-center gap-1">
          {items.map((it) => {
            const active = pathname?.startsWith(it.href);
            return (
              <Link key={it.href} href={it.href} className="relative px-3 py-1.5 rounded-lg text-sm">
                <span className={clsx("font-semibold", active ? "text-white" : "text-[var(--muted)] hover:text-[var(--text)]")}>
                  {it.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/10 border border-white/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
