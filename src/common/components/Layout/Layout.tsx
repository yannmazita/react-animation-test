// src/common/components/Layout/Layout.tsx
import { Outlet } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/80 sticky top-0 z-50 backdrop-blur-sm">
        <NavigationBar />
      </header>
      <main className="flex grow flex-col px-2 pb-2">
        <Outlet />
      </main>
    </div>
  );
};
