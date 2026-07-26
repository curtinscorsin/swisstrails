"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Map, Heart, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";
import { Logo } from "@/components/brand/logo";

const NAV_ITEMS = [
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/favorites", icon: Heart, label: "Favourites" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar — desktop */}
      <header className="fixed left-0 right-0 top-0 z-40 hidden h-16 items-center gap-7 border-b border-white/[0.07] bg-trail-950/92 px-7 backdrop-blur-2xl lg:flex">
        <Link href="/explore" className="mr-2">
          <Logo
            iconClassName="h-5 text-gold-300"
            wordmarkClassName="h-3.5 text-fg"
          />
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/explore" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "pressable flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-200",
                  isActive ? "bg-stone-100 text-trail-950" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-alpine-800" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-xs text-fg-subtle transition-colors hover:text-fg">
            Visit Swiss Trails ↗
          </Link>
        </div>
      </header>

      {/* Bottom nav — mobile: a floating glass pill. The outer wrapper is
          click-through (pointer-events-none) so the map fills the gaps beside
          the pill; only the pill itself is interactive. Geometry keys off the
          shared --nav vars so the shell padding and bottom sheet stay in sync. */}
      <nav
        className="lg:hidden fixed inset-x-0 z-40 px-3 pointer-events-none"
        style={{ bottom: "calc(var(--safe-b) + var(--nav-gap))" }}
      >
        <div
          className="card-glass-strong pointer-events-auto mx-auto flex max-w-md items-stretch gap-1 rounded-[22px] px-1.5 shadow-xl"
          style={{ height: "var(--nav-bar-h)" }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/explore" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="pressable relative flex flex-1 flex-col items-center justify-center gap-0.5"
              >
                {isActive && (
                  <motion.span
                    layoutId="navActivePill"
                    className="absolute inset-x-0.5 inset-y-1.5 rounded-[17px] bg-stone-100 shadow-sm"
                    transition={SPRING.snappy}
                  />
                )}
                <item.icon
                  className={cn(
                    "relative w-[22px] h-[22px] transition-colors duration-150",
                    isActive ? "text-alpine-900" : "text-fg-muted"
                  )}
                />
                <span
                  className={cn(
                    "relative t-3xs transition-colors duration-150",
                    isActive ? "text-trail-950" : "text-fg-muted"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
