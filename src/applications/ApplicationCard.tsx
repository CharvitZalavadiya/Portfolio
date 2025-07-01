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

  // Minimize handler: exit maximized mode if minimized
  const handleMinimize = () => {
    if (maximized && onMaximizedChange) onMaximizedChange(false);
  };

  // Always ensure maximized app is above Dock and StatusBar
  const computedZ = maximized ? 99999 : zIndex;

  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setTimeout(() => setOpened(true), 10);
  }, []);

  // For closing animation, listen for a custom event
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const handleClose = (e: CustomEvent) => {
      if (e.detail && e.detail.app === app) {
        setClosing(true);
        setTimeout(() => {
          // After animation, remove from localStorage (simulate close)
          let arr: string[] = [];
          try {
            arr = JSON.parse(localStorage.getItem("currentApplication") || "[]");
            if (!Array.isArray(arr)) arr = [];
          } catch {
            arr = [];
          }
          arr = arr.filter((a) => a !== app);
          localStorage.setItem("currentApplication", JSON.stringify(arr));
          window.dispatchEvent(new Event("applicationChange"));
          // Exit maximized mode on close
          if (onMaximizedChange) onMaximizedChange(false);
        }, 400);
      }
    };
    window.addEventListener('appCloseWithAnim', handleClose as EventListener);
    return () => window.removeEventListener('appCloseWithAnim', handleClose as EventListener);
  }, [app, onMaximizedChange]);

  return (
    <>
      <style jsx>{`
        .app-open {
          animation: appOpenFromBottom 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .app-close {
          animation: appCloseToBottom 0.5s cubic-bezier(0.77, 0, 0.175, 1) both;
        }
        @keyframes appOpenFromBottom {
          0% {
            transform: translateY(80vh) scale(0.05, 0.05);
            opacity: 0.05;
            filter: blur(24px);
            transform-origin: 50% 100%;
          }
          40% {
            transform: translateY(40vh) scale(0.3, 0.15);
            opacity: 0.3;
            filter: blur(10px);
            transform-origin: 50% 100%;
          }
          70% {
            transform: translateY(-2vh) scale(1.04, 1.04);
            opacity: 1;
            filter: blur(1.5px);
            transform-origin: 50% 50%;
          }
          100% {
            transform: translateY(0) scale(1, 1);
            opacity: 1;
            filter: blur(0);
            transform-origin: 50% 50%;
          }
        }
        @keyframes appCloseToBottom {
          0% {
            transform: translateY(0) scale(1, 1);
            opacity: 1;
            filter: blur(0);
            transform-origin: 50% 50%;
          }
          60% {
            transform: translateY(10vh) scale(0.7, 0.4);
            opacity: 0.5;
            filter: blur(8px);
            transform-origin: 50% 100%;
          }
          85% {
            transform: translateY(40vh) scale(0.3, 0.12);
            opacity: 0.2;
            filter: blur(16px);
            transform-origin: 50% 100%;
          }
          100% {
            transform: translateY(80vh) scale(0.05, 0.01);
            opacity: 0.05;
            filter: blur(32px);
            transform-origin: 50% 100%;
          }
        }
        .fixed {
          transition: box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.45s cubic-bezier(0.22, 1, 0.36, 1), height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl flex items-start justify-center ${opened && !closing ? 'app-open' : ''} ${closing ? 'app-close' : ''}`}
        style={{
          width: maximized ? "99dvw" : "80dvw",
          height: maximized ? "99dvh" : "80dvh",
          zIndex: computedZ,
        }}
      >
        <div className="absolute left-3 top-2 z-10">
          <ApplicationActions
            app={app}
            onMaximize={handleMaximize}
            onCloseWithAnim={() => window.dispatchEvent(new CustomEvent('appCloseWithAnim', { detail: { app } }))}
            onMinimize={handleMinimize}
          />
        </div>
        <div className="flex-1 flex items-center justify-center w-full h-full">
          <AppComponent />
        </div>
      </div>
    </>
  );
}
