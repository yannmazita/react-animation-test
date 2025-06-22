// src/core/routes.ts
import { Layout } from "@/common/components/Layout/Layout";
import { navigationItems } from "@/common/utils/navigation";
import { RouteObject, redirect } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      {
        index: true,
        loader: () => redirect(navigationItems[0]?.to ?? "/"),
      },
      {
        path: "/slides",
        lazy: async () => {
          const { Slides } = await import(
            "@/features/slides/components/Slides"
          );
          return { Component: Slides };
        },
      },
      {
        path: "/linkedMenu",
        lazy: async () => {
          const { AnimatedLinkedMenu } = await import(
            "@/features/linkedMenu/components/AnimatedLinkedMenu"
          );
          return { Component: AnimatedLinkedMenu };
        },
      },
    ],
  },
];
