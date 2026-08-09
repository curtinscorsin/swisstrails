import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "hidden-lake",
    name: "High Lakes",
    description:
      "Named lakes with the destination point kept separate from access logistics.",
    icon: "💧",
    count: 26,
    gradient: "from-sky-900/40 to-blue-950/40",
  },
  {
    id: "viewpoint",
    name: "Mountain Viewpoints",
    description:
      "Summits and viewpoints with sourced destination references.",
    icon: "🏔",
    count: 27,
    gradient: "from-alpine-900/40 to-trail-900/40",
  },
  {
    id: "waterfall",
    name: "Waterfalls",
    description: "Named waterfalls with access questions and current-status checks kept visible.",
    icon: "🌊",
    count: 8,
    gradient: "from-cyan-900/40 to-trail-900/40",
  },
  {
    id: "gorge",
    name: "Gorges",
    description: "Gorges and dramatic river-cut landscapes with clearly scoped map points.",
    icon: "🪨",
    count: 8,
    gradient: "from-stone-800/50 to-trail-900/40",
  },
  {
    id: "photo-spot",
    name: "Heritage & Landmarks",
    description: "Villages, bridges, castles and protected cultural destinations.",
    icon: "📸",
    count: 17,
    gradient: "from-rose-950/50 to-trail-900/40",
  },
  {
    id: "forest",
    name: "Forest & Valley",
    description:
      "Protected forests and nature areas presented without invented route claims.",
    icon: "🌲",
    count: 3,
    gradient: "from-teal-900/40 to-trail-900/40",
  },
  {
    id: "glacier",
    name: "Glaciers",
    description: "Glacier and high-alpine destinations with safety-sensitive access left to current sources.",
    icon: "🧊",
    count: 3,
    gradient: "from-sky-800/40 to-trail-900/40",
  },
  {
    id: "alpine-meadow",
    name: "Alpine Meadow",
    description:
      "Broad valleys and alpine landscapes where one pin cannot represent every route.",
    icon: "🌿",
    count: 8,
    gradient: "from-orange-950/50 to-trail-900/40",
  },
];

export const PRICING = {
  amount: 29,
  currency: "CHF",
  period: "one-time" as const,
  features: [
    "Access to 100 source-linked destinations",
    "Federal map references and visible uncertainties",
    "New routes added after source review",
    "Works on all devices — mobile & desktop",
    "Save favourites & plan adventures",
    "No subscription. Ever.",
    "Access for life",
  ],
};
