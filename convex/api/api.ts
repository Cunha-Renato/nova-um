import type { Auth } from "convex/server";

export async function getUserId(auth: Auth) {
  const identity = await auth.getUserIdentity();

  if (!identity) throw new Error("User not Authenticated!");

  return identity.subject;
}
