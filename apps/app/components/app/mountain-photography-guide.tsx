import { Camera, ExternalLink, Footprints, ShieldCheck } from "lucide-react";

const BOOK_ONE = "https://at-verlag.ch/buch/978-3-03902-100-0/the-alpinists-lost-in-the-alps.html";
const BOOK_TWO = "https://at-verlag.ch/buch/978-3-03902-217-5/the-alpinists-lost-in-the-alps-2.html";

export function MountainPhotographyGuide() {
  return (
    <section aria-labelledby="mountain-photography" className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted">
        Responsible mountain photography
      </p>
      <h2 id="mountain-photography" className="mt-2 font-heading text-xl text-stone-100">
        Make the photograph without compromising the hike.
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <GuideItem icon={<ShieldCheck className="h-4 w-4" />} title="Secure footing first">
          Put the camera away wherever the terrain requires both hands. Never step beyond barriers or onto unstable ground for a frame.
        </GuideItem>
        <GuideItem icon={<Camera className="h-4 w-4" />} title="Change perspective">
          Try a lower viewpoint or natural foreground before moving closer to wildlife, cliff edges or protected vegetation.
        </GuideItem>
        <GuideItem icon={<Footprints className="h-4 w-4" />} title="Leave a light trace">
          Stay on permitted paths, carry waste out, keep wildlife distance and prefer public transport when the route supports it.
        </GuideItem>
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-stone-500">
        Editorial inspiration: The Alpinists’ {" "}
        <a className="text-stone-400 underline decoration-white/20 underline-offset-2 hover:text-stone-200" href={BOOK_ONE} target="_blank" rel="noreferrer">
          Lost in the Alps <ExternalLink className="inline h-2.5 w-2.5" />
        </a>{" "}
        and {" "}
        <a className="text-stone-400 underline decoration-white/20 underline-offset-2 hover:text-stone-200" href={BOOK_TWO} target="_blank" rel="noreferrer">
          Lost in the Alps 2 <ExternalLink className="inline h-2.5 w-2.5" />
        </a>.
        These are general, independently paraphrased principles—not location-specific route verification. Route facts remain tied to the official sources above.
      </p>
    </section>
  );
}

function GuideItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-black/15 p-3.5">
      <span className="text-alpine-300">{icon}</span>
      <h3 className="mt-2 text-sm font-medium text-stone-200">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">{children}</p>
    </div>
  );
}
