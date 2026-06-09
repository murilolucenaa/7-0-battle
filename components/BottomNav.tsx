"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Shuffle, Shield, Swords, BarChart2, Star } from "lucide-react";

const TABS = [
  { label: "Sala",    href: "/lobby",   icon: Users    },
  { label: "Draft",   href: "/draft",   icon: Shuffle  },
  { label: "Time",    href: "/team",    icon: Shield   },
  { label: "Batalha", href: "/battle",  icon: Swords   },
  { label: "Liga",    href: "/league",  icon: BarChart2 },
  { label: "Placar",  href: "/result",  icon: Star     },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5",
              "text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              "focus-visible:outline-[var(--green)]",
              active
                ? "text-[var(--green)]"
                : "text-[var(--muted)] hover:text-[var(--text)]",
            ].join(" ")}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
