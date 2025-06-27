import dynamic from "next/dynamic";

const appMap: Record<string, any> = {
  Finder: dynamic(() => import("../applications/Finder"), { ssr: false }),
  GitHub: dynamic(() => import("../applications/GitHub"), { ssr: false }),
  LinkedIn: dynamic(() => import("../applications/LinkedIn"), { ssr: false }),
  Gmail: dynamic(() => import("../applications/Gmail"), { ssr: false }),
  Safari: dynamic(() => import("../applications/Safari"), { ssr: false }),
};

export default function ApplicationCard({
  app,
  zIndex = 1000,
}: {
  app: string;
  zIndex?: number;
}) {
  const AppComponent = appMap[app] || null;
  if (!AppComponent) return null;
  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100/90 rounded-2xl shadow-2xl flex items-center justify-center w-[80dvw] h-[80dvh]"
      style={{ width: "80dvw", height: "80dvh", zIndex }}
    >
      <AppComponent />
    </div>
  );
}
