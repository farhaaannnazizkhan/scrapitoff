import { cookies } from 'next/headers';

export const DEMO_ROLE_COOKIE = "scrapitoff_demo_role";
export type DemoRole = "citizen" | "collector" | "recycler";

export async function getDemoRole(): Promise<DemoRole> {
  const cookieStore = await cookies();
  const role = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  if (role === "collector" || role === "recycler") {
    return role as DemoRole;
  }
  return "citizen";
}

export async function setDemoRole(role: DemoRole): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE, role, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
