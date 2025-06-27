import { useEffect, useState } from "react";
import StatusBar from "../components/StatusBar";
import Dock from "../components/Dock";
import ApplicationCard from "../applications/ApplicationCard";

const HomePage = () => {
  const [application, setApplication] = useState("Finder");
  const [apps, setApps] = useState<string[]>([]);

  useEffect(() => {
    const getApps = () => {
      try {
        const arr = JSON.parse(localStorage.getItem("currentApplication") || "[]");
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

  const handleSleep = () => {
    localStorage.setItem('loggedin', 'false');
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <>
      <StatusBar application={application} />
      <div className="relative w-[100dvw] h-[100dvh] overflow-hidden flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          {/* <button onClick={handleSleep}>Sleep</button> */}
          {apps.map((app, idx) => (
            <ApplicationCard key={app} app={app} zIndex={1000 + apps.length - idx} />
          ))}
        </div>
        <div className="fixed bottom-3 left-0 w-full flex justify-center z-50">
          <Dock setApplication={setApplication} />
        </div>
      </div>
    </>
  );
};

export default HomePage;