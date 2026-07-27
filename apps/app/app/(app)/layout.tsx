import { AppHeader } from "@/components/app/app-header";
import { ScrollLock } from "@/components/app/scroll-lock";
import { MapAppPicker } from "@/components/app/map-app-picker";
import { PageTransition } from "@/components/app/page-transition";
import { FavoritesHydrator } from "@/components/app/favorites-hydrator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh flex flex-col bg-trail-950">
      <ScrollLock />
      <FavoritesHydrator />
      <AppHeader />
      <main className="relative flex-1 overflow-hidden pb-[var(--nav-h)] lg:pb-0 lg:pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <MapAppPicker />
    </div>
  );
}
