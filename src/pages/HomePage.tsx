import { useEffect, useState } from "react";
import StatusBar from "../components/StatusBar";
import Dock from "../components/Dock";
import ApplicationCard from "../applications/ApplicationCard";

const HomePage = () => {
  const [application, setApplication] = useState("Finder");
  const [apps, setApps] = useState<string[]>([]);
  const [anyMaximized, setAnyMaximized] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [forceShowStatusBar, setForceShowStatusBar] = useState(false);

  useEffect(() => {
    let dockHovering = false;
    let statusBarHovering = false;
    const dockAreaHeight = 12; // px, area at bottom where dock can be hovered
    const dockStayArea = 100; // px, area from bottom to keep dock visible
    const statusBarAreaHeight = 3; // px, area at top where statusbar can be hovered
    const statusBarStayArea = 20; // px, area from top to keep statusbar visible
    const handleMouseMove = (e: MouseEvent) => {
      const y = e.clientY;
      if (anyMaximized) {
        // Mutually exclusive: only one bar at a time
        if (y <= statusBarAreaHeight || statusBarHovering) {
          setShowStatusBar(true);
          setShowDock(false);
          return;
        }
        if (showStatusBar && y <= statusBarStayArea) {
          setShowStatusBar(true);
          setShowDock(false);
          return;
        }
        if (window.innerHeight - y <= dockAreaHeight || dockHovering) {
          setShowDock(true);
          setShowStatusBar(false);
          return;
        }
        if (showDock && window.innerHeight - y <= dockStayArea) {
          setShowDock(true);
          setShowStatusBar(false);
          return;
        }
        setShowDock(false);
        setShowStatusBar(false);
      } else {
        // In normal mode, StatusBar is always visible
        setShowStatusBar(true);
        // Dock logic
        if (window.innerHeight - y <= dockAreaHeight || dockHovering) {
          setShowDock(true);
        } else if (showDock && window.innerHeight - y <= dockStayArea) {
          setShowDock(true);
        } else {
          setShowDock(false);
        }
      }
    };
    // Listen for mouseenter/leave on dock area to keep dock visible while hovering
    const dockEl = document.getElementById('dock-bar');
    const onDockEnter = () => {
      dockHovering = true;
      setShowDock(true);
      if (anyMaximized) setShowStatusBar(false);
    };
    const onDockLeave = () => {
      dockHovering = false;
    };
    // StatusBar hover logic (top area)
    const statusBarEl = document.getElementById('status-bar');
    const onStatusBarEnter = () => {
      statusBarHovering = true;
      setShowStatusBar(true);
      if (anyMaximized) setShowDock(false);
    };
    const onStatusBarLeave = () => {
      statusBarHovering = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    if (dockEl) {
      dockEl.addEventListener('mouseenter', onDockEnter);
      dockEl.addEventListener('mouseleave', onDockLeave);
    }
    if (statusBarEl) {
      statusBarEl.addEventListener('mouseenter', onStatusBarEnter);
      statusBarEl.addEventListener('mouseleave', onStatusBarLeave);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (dockEl) {
        dockEl.removeEventListener('mouseenter', onDockEnter);
        dockEl.removeEventListener('mouseleave', onDockLeave);
      }
      if (statusBarEl) {
        statusBarEl.removeEventListener('mouseenter', onStatusBarEnter);
        statusBarEl.removeEventListener('mouseleave', onStatusBarLeave);
      }
    };
  }, [anyMaximized, showDock, showStatusBar, forceShowStatusBar]);

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
    if (!isMax) {
      setShowDock(true);
      setShowStatusBar(true);
      setForceShowStatusBar(true); // Force StatusBar to show after exiting maximized mode
    }
  };

  return (
    <>
      <div
        id="status-bar"
        className={`fixed top-0 left-0 w-full transition-transform duration-300 z-50`}
        style={{
          transform:
            anyMaximized && !showStatusBar
              ? "translateY(-100%)"
              : "translateY(0)",
        }}
      >
        <StatusBar application={application} forceVisible={showStatusBar} />
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
        id="dock-bar"
        className={`fixed bottom-3 left-0 w-full flex justify-center transition-transform duration-300 z-50`}
        style={{
          transform:
            anyMaximized && !showDock
              ? "translateY(120%)"
              : "translateY(0)",
        }}
      >
        <Dock setApplication={setApplication} forceVisible={showDock} />
      </div>
    </>
  );
};

export default HomePage;
