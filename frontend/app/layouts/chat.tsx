import { Outlet } from "react-router";
import { redirect } from "react-router";
import { userContext } from "~/context";
import type { Route } from "./+types/chat";
import { useServerFetch } from "~/hooks/useServerFetch";

// Client-side timing middleware
async function timingMiddleware({ context }: any, next: () => any) {
  const { $fetch } = useServerFetch();
  const { success, user } = await $fetch({
    path: "auth/me",
    method: "GET",
    credentials: "include",
  });
  if (!success) {
    throw redirect("/");
  }
  context.set(userContext, user);
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  timingMiddleware,
];

export async function clientLoader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <main className="h-screen w-screen flex">
        <div>{JSON.stringify(loaderData.user)}</div>
        <Outlet />
      </main>
    </>
  );
}
