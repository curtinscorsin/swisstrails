"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { APP_URL } from "@/lib/config";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setHasScrolled(y > 60));
    return unsub;
  }, [scrollY]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "The guide", href: "#solution" },
    { label: "Locations", href: "#whats-inside" },
    { label: "Standards", href: "#stats" },
    { label: "Access", href: "#pricing" },
  ];

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top)]",
          isMenuOpen
            ? "bg-trail-950"
            : hasScrolled
              ? "border-b border-white/[0.08] bg-trail-950/88 backdrop-blur-2xl"
              : "bg-transparent"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between lg:h-24">
            {/* Logo */}
            <Link href="/" className="group">
              <Logo
                iconClassName="text-gold-200 group-hover:text-gold-100 transition-colors"
                wordmarkClassName="text-fg"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-9 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-stone-200 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-5 lg:flex">
              <a
                href={`${APP_URL}/login`}
                className="text-sm text-stone-200 transition-colors hover:text-white"
              >
                Log in
              </a>
              <Button asChild size="sm" variant="gold">
                <a href="#pricing">Get the guide</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden -mr-2 w-11 h-11 flex items-center justify-center text-fg-muted hover:text-fg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 lg:hidden"
        initial={false}
        animate={isMenuOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0 bg-trail-950/96 backdrop-blur-2xl"
          onClick={() => setIsMenuOpen(false)}
        />
        <motion.div
          className="absolute left-0 right-0 border-b border-white/[0.08] bg-trail-950 px-5 pb-8 pt-5"
          style={{ top: "calc(env(safe-area-inset-top) + 5rem)" }}
          initial={{ y: -20, opacity: 0 }}
          animate={isMenuOpen ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <nav className="flex flex-col gap-1 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="-mx-2 px-2 py-3 font-heading text-3xl text-stone-200 transition-colors hover:text-fg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <Button asChild variant="gold" size="lg" className="w-full">
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>
                Get lifetime access — CHF 19.90
              </a>
            </Button>
            <a
              href={`${APP_URL}/login`}
              className="block text-center text-fg-muted hover:text-fg text-sm py-3 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Already have access? Log in
            </a>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
