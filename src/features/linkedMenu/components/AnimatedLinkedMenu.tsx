// src/features/linkedMenu/components/AnimatedLinkedMenu.tsx
import { useState, useRef } from "react";
import { MenuButton } from "./MenuButton";
import { ConnectionLines } from "./ConnectionLines";
import { BackgroundPattern } from "./BackgroundPattern";
import { Instructions } from "./Instructions";
import { ActiveInfo } from "./ActiveInfo";

const buttons = [
  { id: "home", label: "Home", x: 100, y: 100, color: "bg-blue-500" },
  { id: "about", label: "About", x: 300, y: 150, color: "bg-green-500" },
  { id: "services", label: "Services", x: 200, y: 280, color: "bg-purple-500" },
  { id: "contact", label: "Contact", x: 450, y: 200, color: "bg-red-500" },
  {
    id: "portfolio",
    label: "Portfolio",
    x: 350,
    y: 350,
    color: "bg-yellow-500",
  },
];

const initialConnections = [
  { from: "home", to: "about", active: false },
  { from: "about", to: "services", active: false },
  { from: "services", to: "contact", active: false },
  { from: "contact", to: "portfolio", active: false },
  { from: "home", to: "services", active: false },
];

export const AnimatedLinkedMenu: React.FC = () => {
  const [connections, setConnections] = useState(initialConnections);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleButtonHover = (id: string | null) => {
    setHoveredButton(id);
    setConnections((prev) =>
      prev.map((conn) => ({
        ...conn,
        active: id ? conn.from === id || conn.to === id : false,
      })),
    );
  };

  const handleButtonClick = (id: string) => {
    setActiveButton((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <BackgroundPattern />
      <ConnectionLines
        buttons={buttons}
        connections={connections}
        svgRef={svgRef}
      />
      <div className="relative z-10">
        {buttons.map((button) => (
          <MenuButton
            key={button.id}
            button={button}
            isHovered={hoveredButton === button.id}
            isActive={activeButton === button.id}
            onHover={handleButtonHover}
            onClick={handleButtonClick}
          />
        ))}
      </div>
      <Instructions />
      <ActiveInfo activeId={activeButton} buttons={buttons} />
    </div>
  );
};
