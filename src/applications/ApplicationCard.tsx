import dynamic from "next/dynamic";
import ApplicationActions from "./applicationActions";
import { useState, useEffect, useRef, ComponentType } from "react";

declare global {
  interface Window {
    __anyMaximized?: boolean;
  }
}

const appMap: Record<string, ComponentType> = {
  Finder: dynamic(() => import("./Finder/Finder"), { ssr: false }),
  GitHub: dynamic(() => import("./GitHub/GitHub"), { ssr: false }),
  LinkedIn: dynamic(() => import("./LinkedIn/LinkedIn"), { ssr: false }),
  Gmail: dynamic(() => import("./Gmail/Gmail"), { ssr: false }),
  Safari: dynamic(() => import("./Safari/Safari"), { ssr: false }),
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
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
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

  useEffect(() => {
    setTimeout(() => setOpened(true), 10);
  }, []);

  // For closing animation, listen for a custom event
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
        }, 500);
      }
    };
    window.addEventListener('appCloseWithAnim', handleClose as EventListener);
    return () => window.removeEventListener('appCloseWithAnim', handleClose as EventListener);
  }, [app, onMaximizedChange]);

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

  // Drag-to-move state
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [windowPos, setWindowPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // Reset position when maximized
  useEffect(() => {
    if (maximized) {
      setWindowPos({ x: 0, y: 0 });
    }
  }, [maximized]);

  // Mouse event handlers
  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart) return;
      setWindowPos((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };
    const handleMouseUp = () => {
      setDragging(false);
      setDragStart(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragStart]);

  // Drag on first click, always show grab cursor on drag area
  const handleDragAreaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maximized) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

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
        ref={windowRef}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl flex items-start justify-center ${opened && !closing ? 'app-open' : ''} ${closing ? 'app-close' : ''}`}
        style={{
          width: maximized ? "99dvw" : "80dvw",
          height: maximized ? "99dvh" : "80dvh",
          zIndex: computedZ,
          cursor: dragging ? 'grabbing' : undefined,
          left: maximized ? '50%' : `calc(50% + ${windowPos.x}px)`,
          top: maximized ? '50%' : `calc(50% + ${windowPos.y}px)`,
        }}
      >
        <div
          ref={dragAreaRef}
          className="absolute z-10 w-full h-[40px] cursor-grab"
          onMouseDown={handleDragAreaMouseDown}
          style={{ userSelect: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
        >
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
