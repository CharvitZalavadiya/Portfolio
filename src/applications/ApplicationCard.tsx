import dynamic from "next/dynamic";
import ApplicationActions from "./applicationActions";
import { useState, useEffect, useRef, ComponentType } from "react";
import AppNameBar from "@/components/AppNameBar";
import { Copy, ExternalLink, Pencil } from "lucide-react";

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
  // Safari: dynamic(() => import("./Safari/Safari"), { ssr: false }),
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
  const [minimizing, setMinimizing] = useState(false);
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
            arr = JSON.parse(
              localStorage.getItem("currentApplication") || "[]"
            );
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
    window.addEventListener("appCloseWithAnim", handleClose as EventListener);
    return () =>
      window.removeEventListener(
        "appCloseWithAnim",
        handleClose as EventListener
      );
  }, [app, onMaximizedChange]);

  // For minimize animation, listen for a custom event
  useEffect(() => {
    const handleMinimizeAnim = (e: CustomEvent) => {
      if (e.detail && e.detail.app === app) {
        setMinimizing(true);
        setTimeout(() => {
          // After animation, minimize the app
          let arr: string[] = [];
          let minArr: string[] = [];
          try {
            arr = JSON.parse(
              localStorage.getItem("currentApplication") || "[]"
            );
            if (!Array.isArray(arr)) arr = [];
          } catch {
            arr = [];
          }
          try {
            minArr = JSON.parse(
              localStorage.getItem("minimizedApplication") || "[]"
            );
            if (!Array.isArray(minArr)) minArr = [];
          } catch {
            minArr = [];
          }
          arr = arr.filter((a) => a !== app);
          if (!minArr.includes(app)) minArr.unshift(app);
          localStorage.setItem("currentApplication", JSON.stringify(arr));
          localStorage.setItem("minimizedApplication", JSON.stringify(minArr));
          window.dispatchEvent(new Event("applicationChange"));
          setMinimizing(false);
          // Exit maximized mode on minimize
          if (onMaximizedChange) onMaximizedChange(false);
        }, 350);
      }
    };
    window.addEventListener(
      "appMinimizeWithAnim",
      handleMinimizeAnim as EventListener
    );
    return () =>
      window.removeEventListener(
        "appMinimizeWithAnim",
        handleMinimizeAnim as EventListener
      );
  }, [app, onMaximizedChange]);

  const AppComponent = appMap[app] || null;

  const handleMaximize = () => {
    setMaximized((m) => !m);
  };

  // Always ensure maximized app is above Dock and StatusBar
  const computedZ = maximized ? 99999 : zIndex;

  // Drag-to-move state
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [windowPos, setWindowPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragStart]);

  // Drag on first click, always show grab cursor on drag area
  const handleDragAreaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maximized) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  // --- Resizing logic ---
  const minWidth = 55; // dvw
  const minHeight = 55; // dvh
  const [dimensions, setDimensions] = useState({ width: 80, height: 80 }); // in dvw/dvh
  const [resizing, setResizing] = useState<null | {
    dir: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>(null);

  // Mouse move handler for resizing
  useEffect(() => {
    if (!resizing) return;
    const onMouseMove = (e: MouseEvent) => {
      const dx = ((e.clientX - resizing.startX) * 100) / window.innerWidth;
      const dy = ((e.clientY - resizing.startY) * 100) / window.innerHeight;
      let newW = resizing.startW;
      let newH = resizing.startH;
      if (resizing.dir.includes("e"))
        newW = Math.max(minWidth, resizing.startW + dx);
      if (resizing.dir.includes("s"))
        newH = Math.max(minHeight, resizing.startH + dy);
      if (resizing.dir.includes("w"))
        newW = Math.max(minWidth, resizing.startW - dx);
      if (resizing.dir.includes("n"))
        newH = Math.max(minHeight, resizing.startH - dy);
      setDimensions({ width: newW, height: newH });
    };
    const onMouseUp = () => setResizing(null);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizing]);

  if (!AppComponent) {
    // Always call hooks before any return!
    return null;
  }

  // Handler to bring this app to front (topmost in z-order)
  const handleBringToFront = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only bring to front if not already topmost
    try {
      let arr: string[] = JSON.parse(
        localStorage.getItem("currentApplication") || "[]"
      );
      if (!Array.isArray(arr)) arr = [];
      if (arr[0] !== app) {
        arr = [app, ...arr.filter((a) => a !== app)];
        localStorage.setItem("currentApplication", JSON.stringify(arr));
        window.dispatchEvent(new Event("applicationChange"));
      }
    } catch {}
    // Always stop propagation so any click on the popup brings to front, but allow drag area to still work
    e.stopPropagation();
  };

  return (
    <>
      <style jsx>{`
        .app-open {
          animation: appZoomIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .app-close {
          animation: appZoomOut 0.35s cubic-bezier(0.77, 0, 0.175, 1) both;
        }
        @keyframes appZoomIn {
          0% {
            transform: scale(0.7);
            opacity: 0.2;
            filter: blur(8px);
          }
          80% {
            transform: scale(1.04);
            opacity: 1;
            filter: blur(0.5px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes appZoomOut {
          0% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
          80% {
            transform: scale(0.7);
            opacity: 0.2;
            filter: blur(8px);
          }
          100% {
            transform: scale(0.6);
            opacity: 0;
            filter: blur(16px);
          }
        }
        .fixed {
          transition: box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-radius 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .resize-handle-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          z-index: 20;
        }
        .resize-handle-side {
          position: absolute;
          z-index: 20;
          background: transparent;
        }
        .resize-handle-side.n,
        .resize-handle-side.s {
          left: 16px;
          right: 16px;
          height: 10px;
        }
        .resize-handle-side.n {
          top: -5px;
          cursor: ns-resize;
        }
        .resize-handle-side.s {
          bottom: -5px;
          cursor: ns-resize;
        }
        .resize-handle-side.e,
        .resize-handle-side.w {
          top: 16px;
          bottom: 16px;
          width: 10px;
        }
        .resize-handle-side.e {
          right: -5px;
          cursor: ew-resize;
        }
        .resize-handle-side.w {
          left: -5px;
          cursor: ew-resize;
        }
      `}</style>
      <div
        ref={windowRef}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl flex flex-col items-stretch justify-start ${
          opened && !closing && !minimizing ? "app-open" : ""
        } ${closing || minimizing ? "app-close" : ""}`}
        style={{
          width: maximized ? "99dvw" : `${dimensions.width}dvw`,
          height: maximized ? "99dvh" : `${dimensions.height}dvh`,
          minWidth: maximized ? undefined : "55dvw",
          minHeight: maximized ? undefined : "55dvh",
          zIndex: computedZ,
          cursor: dragging ? "grabbing" : undefined,
          left: maximized ? "50%" : `calc(50% + ${windowPos.x}px)`,
          top: maximized ? "50%" : `calc(50% + ${windowPos.y}px)`,
        }}
        onMouseDown={handleBringToFront}
      >
        {/* Top bar: ApplicationActions + AppNameBar (except Finder) */}
        <div
          className="flex flex-row items-center w-full"
          style={{ height: 40 }}
        >
          <div
            ref={dragAreaRef}
            className="flex-shrink-0 flex items-center h-full"
            style={{
              width: 240,
              zIndex: 10,
              userSelect: "none",
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleDragAreaMouseDown}
          >
            <ApplicationActions
              app={app}
              onMaximize={handleMaximize}
              onCloseWithAnim={() =>
                window.dispatchEvent(
                  new CustomEvent("appCloseWithAnim", { detail: { app } })
                )
              }
              onMinimize={() =>
                window.dispatchEvent(
                  new CustomEvent("appMinimizeWithAnim", { detail: { app } })
                )
              }
            />
          </div>
          {/* AppNameBar takes the rest of the width, except for Finder */}
          {app !== "Finder" && (
            <div className="flex-1 flex items-center h-full pl-2 pr-4">
              <AppNameBar
                name={
                  app === "GitHub"
                    ? "github.com/CharvitZalavadiya"
                    : app === "LinkedIn"
                    ? "linkedin.com/in/charvitzalavadiya"
                    : app === "Gmail"
                    ? "charvitzalavadiya@gmail.com"
                    : app
                }
                logo={
                  app === "GitHub"
                    ? "/apps/github.png"
                    : app === "LinkedIn"
                    ? "/apps/linkedin.png"
                    : app === "Gmail"
                    ? "/apps/gmail.png"
                    : undefined
                }
                copyIcon={
                  <Copy size={18} style={{ cursor: "pointer", opacity: 0.3 }} />
                }
                redirectIcon={
                  app === "GitHub" ? (
                    <ExternalLink
                      onClick={() =>
                        window.open(
                          "https://github.com/CharvitZalavadiya",
                          "_blank"
                        )
                      }
                      size={18}
                      style={{ cursor: "pointer", opacity: 0.5 }}
                    />
                  ) : app === "LinkedIn" ? (
                    <ExternalLink
                    onClick={() =>
                        window.open(
                          "https://linkedin.com/in/charvitzalavadiya",
                          "_blank"
                        )
                      }
                      size={18}
                      style={{ cursor: "pointer", opacity: 0.5 }}
                    />
                  ) : app === "Gmail" ? (
                    <Pencil
                      onClick={() =>
                        window.open(
                          // "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=charvitzalavadiya@gmail.com&tf=1",
                          // "https://accounts.google.com/AccountChooser?continue=https://mail.google.com/mail/u/0/?view=cm&fs=1&to=charvitzalavadiya@gmail.com&tf=1&service=mail&hd=default",
                          "https://mail.google.com/mail/u/0/#inbox?compose=new",
                          "_blank"
                        )
                      }
                      size={18}
                      style={{ cursor: "pointer", opacity: 0.5 }}
                    />
                  ) : undefined
                }
              />
            </div>
          )}
        </div>
        {/* App content fills the rest of the popup */}
        <div className="flex-1 flex items-center justify-center w-full h-0 min-h-0">
          <AppComponent />
        </div>
        {/* Resize handles (only in normal mode) */}
        {!maximized && (
          <>
            {/* Corners */}
            <div
              className="resize-handle-corner"
              style={{ top: 0, left: 0, cursor: "nwse-resize" }}
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "nw",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            <div
              className="resize-handle-corner"
              style={{ top: 0, right: 0, cursor: "nesw-resize" }}
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "ne",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            <div
              className="resize-handle-corner"
              style={{ bottom: 0, left: 0, cursor: "nesw-resize" }}
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "sw",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            <div
              className="resize-handle-corner"
              style={{ bottom: 0, right: 0, cursor: "nwse-resize" }}
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "se",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            {/* Sides */}
            <div
              className="resize-handle-side n"
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "n",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            <div
              className="resize-handle-side s"
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "s",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            <div
              className="resize-handle-side e"
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "e",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
            <div
              className="resize-handle-side w"
              onMouseDown={(e) => {
                e.preventDefault();
                setResizing({
                  dir: "w",
                  startX: e.clientX,
                  startY: e.clientY,
                  startW: dimensions.width,
                  startH: dimensions.height,
                });
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
