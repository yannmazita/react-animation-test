// src/features/linkedMenu/components/ActiveInfo.tsx
interface Props {
  activeId: string | null;
  buttons: { id: string; label: string }[];
}

export const ActiveInfo: React.FC<Props> = ({ activeId, buttons }) => {
  if (!activeId) return null;
  const button = buttons.find((b) => b.id === activeId);
  return (
    <div className="absolute top-8 right-8 rounded-lg border border-white/10 bg-black/50 px-6 py-4 text-white backdrop-blur-sm">
      <h3 className="mb-2 text-lg font-bold">Active: {button?.label}</h3>
      <p className="text-sm text-white/70">Connected to other menu items</p>
    </div>
  );
};
