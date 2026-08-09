import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "hidden-lake",
    name: "Hidden Lakes",
    description:
      "Lake destinations with the water body kept separate from unverified access points and parking.",
    icon: "💧",
    count: 26,
    gradient: "from-sky-900/40 to-blue-950/40",
  },
  {
    id: "viewpoint",
    name: "Viewpoints & Heritage",
    description:
      "Named viewpoints and mountain destinations with honest map-point explanations.",
    icon: "🏔",
    count: 29,
    gradient: "from-alpine-900/40 to-trail-900/40",
  },
  {
    id: "waterfall",
    name: "Waterfalls",
    description:
      "Named waterfalls with source-linked map points and current access questions kept visible.",
    icon: "🌊",
    count: 8,
    gradient: "from-teal-900/40 to-trail-900/40",
  },
  {
    id: "photo-spot",
    name: "Photo Locations",
    description:
      "Landmarks and old towns presented with a source trail and location-linked photography where approved.",
    icon: "📸",
    count: 15,
    gradient: "from-rose-950/50 to-trail-900/40",
  },
];

export const PRICING = {
  amount: 29,
  currency: "CHF",
  period: "one-time" as const,
  features: [
    "Instant access to 100 sourced destinations",
    "Separate destination and access coordinates",
    "New places only after manual verification",
    "Works on all devices — mobile & desktop",
    "Save favourites & plan adventures",
    "No subscription. Ever.",
    "Access for life",
  ],
};
