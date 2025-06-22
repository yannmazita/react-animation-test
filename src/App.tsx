// src/App.tsx
import { Slides } from "./features/slides/components/Slides";

export const App: React.FC = () => {
  return (
    <div className="relative flex grow flex-col">
      <Slides />
    </div>
  );
};
