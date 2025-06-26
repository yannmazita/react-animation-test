// src/common/utils/navigation.ts
export interface NavigationItem {
  id: string;
  name: string;
  to: string;
}

export const navigationItems: NavigationItem[] = [
  { id: "slides", name: "SLIDES", to: "slides" },
  { id: "lightning", name: "LIGHTNING", to: "lightning" },
  {
    id: "lightning-optimized",
    name: "LIGHTNING-OPTIMIZED",
    to: "lightning-optimized",
  },
];

export const GITHUB_URL = "https://github.com/yannmazita";
