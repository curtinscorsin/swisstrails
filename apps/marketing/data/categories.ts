import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "hidden-lake",
    name: "Hidden Lakes",
    description:
      "Alpine lakes so clear they'll make you question reality. Most tourists will never find them.",
    icon: "💧",
    count: 82,
    gradient: "from-sky-900/40 to-blue-950/40",
  },
  {
    id: "viewpoint",
    name: "Secret Viewpoints",
    description:
      "The perspectives that make Switzerland look like a painting. Never crowded.",
    icon: "🏔",
    count: 95,
    gradient: "from-alpine-900/40 to-trail-900/40",
  },
  {
    id: "waterfall",
    name: "Waterfalls",
    description:
      "From gentle cascades to thundering falls — Switzerland hides its most spectacular ones.",
    icon: "🌊",
    count: 54,
    gradient: "from-teal-900/40 to-trail-900/40",
  },
  {
    id: "sunset-spot",
    name: "Sunset Spots",
    description:
      "Position yourself perfectly for the golden hour every photographer dreams of.",
    icon: "🌅",
    count: 63,
    gradient: "from-orange-950/50 to-trail-900/40",
  },
  {
    id: "gorge",
    name: "Gorges & Canyons",
    description:
      "Ancient geological wonders carved through rock over millions of years.",
    icon: "🪨",
    count: 46,
    gradient: "from-stone-900/60 to-trail-900/40",
  },
  {
    id: "night-sky",
    name: "Night Sky",
    description:
      "The darkest corners of Switzerland, where the Milky Way is impossible to miss.",
    icon: "✨",
    count: 38,
    gradient: "from-indigo-950/60 to-trail-900/40",
  },
  {
    id: "road-trip",
    name: "Road Trips",
    description:
      "Curated routes through Switzerland's most dramatic landscapes.",
    icon: "🚗",
    count: 51,
    gradient: "from-gold-950/50 to-trail-900/40",
  },
  {
    id: "photo-spot",
    name: "Photo Locations",
    description:
      "Every spot chosen for maximum visual impact. For cameras and phones alike.",
    icon: "📸",
    count: 71,
    gradient: "from-rose-950/50 to-trail-900/40",
  },
];

export const PRICING = {
  amount: 29,
  currency: "CHF",
  period: "one-time" as const,
  features: [
    "Instant access to all 500+ locations",
    "Detailed descriptions, tips & coordinates",
    "New locations added every month",
    "Works on all devices — mobile & desktop",
    "Save favourites & plan adventures",
    "No subscription. Ever.",
    "Access for life",
  ],
};
