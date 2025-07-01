import dynamic from "next/dynamic";

const appMap: Record<string, any> = {
  Finder: dynamic(() => import("./Finder/Finder"), { ssr: false }),
  GitHub: dynamic(() => import("./GitHub/GitHub"), { ssr: false }),
  LinkedIn: dynamic(() => import("./LinkedIn/LinkedIn"), { ssr: false }),
  Gmail: dynamic(() => import("./Gmail/Gmail"), { ssr: false }),
  Safari: dynamic(() => import("./Safari/Safari"), { ssr: false }),
};

// Remove multi-app logic, now just renders the app passed as prop
export default function ApplicationCard({ app }: { app: string }) {
  const AppComponent = appMap[app] || null;
  if (!AppComponent) return null;
  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100/90 rounded-2xl shadow-2xl flex items-center justify-center w-[80dvw] h-[80dvh]"
      style={{ width: "80dvw", height: "80dvh" }}
    >
      <AppComponent />
    </div>
  );
}
