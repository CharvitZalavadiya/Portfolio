import { useEffect, useState } from "react";
import StatusBar from "../components/StatusBar";
import Dock from "../components/Dock";
import ApplicationCard from "../applications/ApplicationCard";

const HomePage = () => {
  const [application, setApplication] = useState("Finder");
  const [apps, setApps] = useState<string[]>([]);
  const [anyMaximized, setAnyMaximized] = useState(false);

  useEffect(() => {
    const getApps = () => {
      try {
        const arr = JSON.parse(
          localStorage.getItem("currentApplication") || "[]"
        );
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    };
    setApps(getApps());
    const handler = () => setApps(getApps());
    window.addEventListener("storage", handler);
    window.addEventListener("applicationChange", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("applicationChange", handler);
    };
  }, []);

  // Listen for maximized state from any ApplicationCard
  const handleMaximizedChange = (isMax: boolean) => {
    setAnyMaximized(isMax);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full transition-transform duration-300 z-50`}
        style={{
          transform: anyMaximized ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <StatusBar application={application} />
      </div>
      <div className="relative w-[100dvw] h-[100dvh] overflow-hidden flex items-center justify-center">
        <div className="relative z-5 flex flex-col items-center justify-center w-full h-full">
          {apps.map((app, idx) => (
            <ApplicationCard
              key={app}
              app={app}
              zIndex={1000 + apps.length - idx}
              onMaximizedChange={handleMaximizedChange}
            />
          ))}
        </div>
      </div>
      <div
        className={`fixed bottom-3 left-0 w-full flex justify-center transition-transform duration-300 z-50`}
        style={{
          transform: anyMaximized ? "translateY(120%)" : "translateY(0)",
        }}
      >
        <Dock setApplication={setApplication} />
      </div>
    </>
  );
};

export default HomePage;
