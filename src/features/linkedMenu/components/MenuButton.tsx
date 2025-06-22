// src/features/linkedMenu/components/MenuButton.tsx
interface Props {
  button: {
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
  };
  isHovered: boolean;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

export const MenuButton: React.FC<Props> = ({
  button,
  isHovered,
  isActive,
  onHover,
  onClick,
}) => {
  return (
    <button
      className={`absolute transform transition-all duration-300 hover:scale-110 active:scale-95 ${button.color} rounded-full border-2 border-transparent px-6 py-3 font-semibold text-white shadow-lg hover:border-white/20 hover:shadow-xl ${
        isActive ? "scale-110 ring-4 ring-white/50" : ""
      } ${isHovered ? "shadow-2xl" : ""}`}
      style={{
        left: `${button.x}px`,
        top: `${button.y}px`,
        filter: isHovered ? "brightness(1.2)" : "brightness(1)",
        boxShadow: isHovered
          ? `0 0 30px ${button.color.replace("bg-", "").replace("-500", "")}, 0 10px 25px rgba(0,0,0,0.3)`
          : "0 4px 15px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={() => onHover(button.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(button.id)}
    >
      <span className="relative z-10">{button.label}</span>
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${isActive ? "animate-ping bg-white/20" : ""}`}
      />
    </button>
  );
};
