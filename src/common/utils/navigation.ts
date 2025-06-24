// src/common/utils/navigation.ts
export interface NavigationItem {
  id: string;
  name: string;
  to: string;
}

export const navigationItems: NavigationItem[] = [
  { id: "slides", name: "SLIDES", to: "slides" },
  { id: "slices", name: "SLICES", to: "slices" },
];

export const GITHUB_URL = "https://github.com/yannmazita";
