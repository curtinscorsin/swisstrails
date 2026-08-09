import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "hidden-lake",
    name: "High Lakes",
    description:
      "Verified routes where alpine lakes are the defining landscape.",
    icon: "💧",
    count: 1,
    gradient: "from-sky-900/40 to-blue-950/40",
  },
  {
    id: "viewpoint",
    name: "Mountain Viewpoints",
    description:
      "Mountain routes with a documented summit or viewpoint.",
    icon: "🏔",
    count: 1,
    gradient: "from-alpine-900/40 to-trail-900/40",
  },
  {
    id: "forest",
    name: "Forest & Valley",
    description:
      "Marked routes through protected mountain forest and valleys.",
    icon: "🌲",
    count: 3,
    gradient: "from-teal-900/40 to-trail-900/40",
  },
  {
    id: "alpine-meadow",
    name: "Alpine Meadow",
    description:
      "Routes defined by open pasture and high-alpine habitat.",
    icon: "🌿",
    count: 1,
    gradient: "from-orange-950/50 to-trail-900/40",
  },
];

export const PRICING = {
  amount: 29,
  currency: "CHF",
  period: "one-time" as const,
  features: [
    "Access to the source-checked place collection",
    "Official sources, restrictions & coordinates",
    "New routes added after source review",
    "Works on all devices — mobile & desktop",
    "Save favourites & plan adventures",
    "No subscription. Ever.",
    "Access for life",
  ],
};
