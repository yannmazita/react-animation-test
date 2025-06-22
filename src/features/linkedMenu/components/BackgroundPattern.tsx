// src/features/linkedMenu/components/BackgroundPattern.tsx
export const BackgroundPattern: React.FC = () => (
  <div className="absolute inset-0 opacity-10">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
        backgroundSize: "50px 50px",
      }}
    />
  </div>
);
