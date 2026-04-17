"use client"

import { Show } from "@clerk/react";
import SignInPage from "./sign_in_page";

export default function Auth({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Show when="signed-in" fallback={<SignInPage />}>
      {children}
    </Show>
  );
}