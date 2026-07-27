// Skeleton must mirror the real masonry (aspect-ratio columns, not fixed px
// heights) so swapping to content doesn't re-flow the wall. Keep in sync with
// ASPECT_RATIOS in page.tsx.
const ASPECT_RATIOS = ["3/4", "4/5", "2/3", "4/5", "3/4", "1/1", "4/5", "3/5"];

export default function ExploreLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b border-white/[0.07] px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 lg:px-7 lg:pb-4 lg:pt-5">
        <div className="mb-4 hidden justify-between lg:flex">
          <div className="h-9 w-64 rounded-lg bg-surface-2 animate-pulse" />
          <div className="h-8 w-80 rounded-lg bg-surface-1 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-12 flex-1 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-12 w-24 rounded-full bg-surface-2 animate-pulse" />
        </div>
        <div className="mt-2.5 flex gap-2">
          {[76, 82, 74].map((w) => (
            <div
              key={w}
              className="h-9 rounded-full bg-surface-1 animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="columns-2 px-3 pt-3 [column-gap:10px] sm:px-5 sm:[column-gap:14px] lg:columns-3 lg:px-7 xl:columns-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="mb-2.5 break-inside-avoid rounded-2xl bg-surface-1 animate-pulse sm:mb-3.5"
              style={{ aspectRatio: ASPECT_RATIOS[i % ASPECT_RATIOS.length] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
