// src/core/stores/useMenuStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { navigationItems, NavigationItem } from "@/common/utils/navigation";

interface MenuState {
  items: NavigationItem[];
  selectedIndex: number;
  selectNext: () => void;
  selectPrevious: () => void;
  setSelectedIndex: (index: number) => void;
  setSelectedByPath: (path: string) => void;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set) => ({
      items: navigationItems,
      selectedIndex: 0, // Default to the first item

      selectNext: () =>
        set((state) => ({
          selectedIndex: (state.selectedIndex + 1) % state.items.length,
        })),

      selectPrevious: () =>
        set((state) => ({
          selectedIndex:
            (state.selectedIndex - 1 + state.items.length) % state.items.length,
        })),

      setSelectedIndex: (index) =>
        set((state) => {
          if (index >= 0 && index < state.items.length) {
            return { selectedIndex: index };
          }
          return {};
        }),

      setSelectedByPath: (path) =>
        set((state) => {
          const cleanPath = path.startsWith("/") ? path.substring(1) : path;
          const index = state.items.findIndex((item) => item.to === cleanPath);
          if (index !== -1) {
            return { selectedIndex: index };
          }
          return {};
        }),
    }),
    {
      name: "menu-store",
    },
  ),
);
