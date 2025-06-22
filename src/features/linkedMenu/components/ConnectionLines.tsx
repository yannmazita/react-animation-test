// src/features/linkedMenu/components/ConnectionLines.tsx
interface Props {
  buttons: {
    id: string;
    x: number;
    y: number;
  }[];
  connections: {
    from: string;
    to: string;
    active: boolean;
  }[];
  svgRef: React.RefObject<SVGSVGElement>;
}

export const ConnectionLines: React.FC<Props> = ({
  buttons,
  connections,
  svgRef,
}) => {
  const getButtonCenter = (id: string) => {
    const btn = buttons.find((b) => b.id === id);
    return btn ? { x: btn.x + 40, y: btn.y + 20 } : { x: 0, y: 0 };
  };

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 1 }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {connections.map((conn, index) => {
        const from = getButtonCenter(conn.from);
        const to = getButtonCenter(conn.to);
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const controlX = midX + (Math.random() - 0.5) * 100;
        const controlY = midY - 50;
        const pathData = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;

        return (
          <g key={`${conn.from}-${conn.to}`}>
            <path
              d={pathData}
              stroke={conn.active ? "#60a5fa" : "#374151"}
              strokeWidth={conn.active ? "3" : "2"}
              fill="none"
              strokeDasharray={conn.active ? "0" : "5,5"}
              className={`transition-all duration-300 ${conn.active ? "opacity-100" : "opacity-30"}`}
              style={{
                filter: conn.active
                  ? "drop-shadow(0 0 8px rgba(96, 165, 250, 0.6))"
                  : "none",
              }}
            />
            {conn.active && (
              <circle r="4" fill="#60a5fa" className="animate-pulse">
                <animateMotion dur="2s" repeatCount="indefinite">
                  <mpath href={`#path-${index}`} />
                </animateMotion>
              </circle>
            )}
            <path
              id={`path-${index}`}
              d={pathData}
              stroke="none"
              fill="none"
              className="opacity-0"
            />
          </g>
        );
      })}
    </svg>
  );
};
