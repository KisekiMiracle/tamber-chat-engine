import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <main className="relative h-screen w-screen flex items-center justify-center">
        <div className="mesh-bg" />
        <div className="xl:max-w-6/12 w-full p-8 grid grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src="https://picsum.photos/900"
              className="rounded-2xl brightness-40"
              style={{ height: "550px" }}
            />
            <div className="absolute z-1 bottom-0 text-white p-4">
              <h1 className="text-4xl font-bold">Tamber Engine</h1>
              <span className="text-sm">A Browser-based Chat Application.</span>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </>
  );
}
