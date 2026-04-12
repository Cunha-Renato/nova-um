"use client"

import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type React from "react";

const client = new ConvexReactClient(import.meta.env.VITE_PUBLIC_CONVEX_URL);

export default function ConvexClerkProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}
      domain={import.meta.env.CLERK_FRONTEND_API_URL}>
      <ConvexProviderWithClerk client={client} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}