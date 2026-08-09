import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "hidden-lake",
    name: "Hidden Lakes",
    description:
      "A source-checked mountain-lake entry with its destination and access points kept separate.",
    icon: "💧",
    count: 1,
    gradient: "from-sky-900/40 to-blue-950/40",
  },
  {
    id: "viewpoint",
    name: "Viewpoints & Heritage",
    description:
      "Named viewpoints and multi-site heritage places with honest map-point explanations.",
    icon: "🏔",
    count: 2,
    gradient: "from-alpine-900/40 to-trail-900/40",
  },
  {
    id: "waterfall",
    name: "Waterfalls",
    description:
      "A major waterfall whose two banks have different access, fee and accessibility conditions.",
    icon: "🌊",
    count: 1,
    gradient: "from-teal-900/40 to-trail-900/40",
  },
  {
    id: "photo-spot",
    name: "Photo Locations",
    description:
      "Four public landmarks and old towns presented with photographs of the exact named place.",
    icon: "📸",
    count: 4,
    gradient: "from-rose-950/50 to-trail-900/40",
  },
];

export const PRICING = {
  amount: 29,
  currency: "CHF",
  period: "one-time" as const,
  features: [
    "Instant access to 8 source-checked places",
    "Separate destination and access coordinates",
    "New places only after manual verification",
    "Works on all devices — mobile & desktop",
    "Save favourites & plan adventures",
    "No subscription. Ever.",
    "Access for life",
  ],
};
