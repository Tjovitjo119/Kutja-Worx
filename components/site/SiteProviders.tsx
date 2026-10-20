"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CartProvider } from "./CartProvider";
import CartDrawer from "./CartDrawer";

export default function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
