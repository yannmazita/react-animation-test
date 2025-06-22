// src/common/components/Layout/NavigationBar.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMenuStore } from "@/core/stores/useMenuStore";
import { GITHUB_URL } from "@/common/utils/navigation";
import { Button } from "@/common/components/Button";

export const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, selectedIndex, setSelectedByPath } = useMenuStore();

  // Sync store state with URL on initial load and on route changes
  useEffect(() => {
    setSelectedByPath(location.pathname);
  }, [location.pathname, setSelectedByPath]);

  const handleNavigation = async (direction: "next" | "previous") => {
    const totalItems = items.length;
    const nextIndex =
      direction === "next"
        ? (selectedIndex + 1) % totalItems
        : (selectedIndex - 1 + totalItems) % totalItems;
    const newPath = items[nextIndex]?.to;
    if (newPath) {
      await navigate(newPath);
    }
  };

  const currentItemName = items[selectedIndex]?.name ?? "::MENU_ITEM::";

  return (
    <nav className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleNavigation("previous")}
          aria-label="Previous Animation"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-primary w-32 text-center font-semibold">
          {currentItemName}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleNavigation("next")}
          aria-label="Next Animation"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button asChild variant="ghost">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Button>
    </nav>
  );
};
