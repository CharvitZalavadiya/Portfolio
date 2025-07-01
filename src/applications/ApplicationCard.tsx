import dynamic from "next/dynamic";
import ApplicationActions from "./applicationActions";
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    __anyMaximized?: boolean;
  }
}

const appMap: Record<string, any> = {
  Finder: dynamic(() => import("../applications/Finder"), { ssr: false }),
  GitHub: dynamic(() => import("../applications/GitHub"), { ssr: false }),
  LinkedIn: dynamic(() => import("../applications/LinkedIn"), { ssr: false }),
  Gmail: dynamic(() => import("../applications/Gmail"), { ssr: false }),
  Safari: dynamic(() => import("../applications/Safari"), { ssr: false }),
};

export default function ApplicationCard({
  app,
  zIndex = 51,
  onMaximizedChange,
}: {
  app: string;
  zIndex?: number;
  dockZ?: number;
  statusBarZ?: number;
  onMaximizedChange?: (isMax: boolean) => void;
}) {
  const [maximized, setMaximized] = useState(false);
  const prevMaximized = useRef(maximized);
  useEffect(() => {
    if (onMaximizedChange && prevMaximized.current !== maximized) {
      onMaximizedChange(maximized);
      prevMaximized.current = maximized;
    }
    // Set global flag for StatusBar animation
    if (typeof window !== "undefined") {
      window.__anyMaximized = maximized;
    }
  }, [maximized, onMaximizedChange]);

  const AppComponent = appMap[app] || null;
  if (!AppComponent) return null;

  const handleMaximize = () => {
    setMaximized((m) => !m);
  };

  // Always ensure maximized app is above Dock and StatusBar
  const computedZ = maximized ? 99999 : zIndex;

  return (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl flex items-start justify-center"
      style={{
        width: maximized ? "99dvw" : "80dvw",
        height: maximized ? "99dvh" : "80dvh",
        zIndex: computedZ,
      }}
    >
      <div className="absolute left-3 top-2 z-10">
        <ApplicationActions app={app} onMaximize={handleMaximize} />
      </div>
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <AppComponent />
      </div>
    </div>
  );
}
