import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface DockProps {
  setApplication: (name: string) => void;
  forceVisible?: boolean;
}

const applications = [
  {
    name: "Finder",
    logo: "/apps/finder.png",
    label: "Finder",
  },
  {
    name: "GitHub",
    logo: "/apps/github.png",
    label: "GitHub",
  },
  {
    name: "LinkedIn",
    logo: "/apps/linkedin.png",
    label: "LinkedIn",
  },
  {
    name: "Gmail",
    logo: "/apps/gmail.png",
    label: "Gmail",
  }
];

const Dock = ({ setApplication, forceVisible }: DockProps) => {
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [minimizedApps, setMinimizedApps] = useState<string[]>([]);

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
    const getMinimized = () => {
      try {
        const arr = JSON.parse(
          localStorage.getItem("minimizedApplication") || "[]"
        );
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    };
    setOpenApps(getApps());
    setMinimizedApps(getMinimized());
    const handler = () => {
      setOpenApps(getApps());
      setMinimizedApps(getMinimized());
    };
    window.addEventListener("storage", handler);
    window.addEventListener("applicationChange", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("applicationChange", handler);
    };
  }, []);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  // Enhanced hover: smoothly interpolate hover between icons when in the gap
  useEffect(() => {
    if (!dockRef.current) return;
    const handleMove = (e: MouseEvent) => {
      const rect = dockRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      // Find the closest app center
      let minDist = Infinity;
      let idx = null;
      for (let i = 0; i < applications.length; i++) {
        const center = (i + 0.5) * (rect.width / applications.length);
        const dist = Math.abs(x - center);
        if (dist < minDist) {
          minDist = dist;
          idx = i;
        }
      }
      setHoveredIdx(idx);
    };
    const handleLeave = () => {
      setHoveredIdx(null);
    };
    const node = dockRef.current;
    node.addEventListener('mousemove', handleMove);
    node.addEventListener('mouseleave', handleLeave);
    return () => {
      node.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // If forceVisible is true, override transform to show Dock
  const dockStyle = forceVisible
    ? { transform: 'translateY(0)', transition: 'transform 0.3s cubic-bezier(0.33,1,0.68,1)' }
    : undefined;

  return (
    <div ref={dockRef} className="flex bg-gray-100/10 backdrop-blur-[2px] gap-5 items-end justify-center p-2 rounded-xl" style={dockStyle}>
      <style jsx>{`
        .dock-app {
          transition:
            transform 0.36s cubic-bezier(0.33,1,0.68,1),
            box-shadow 0.32s cubic-bezier(0.33,1,0.68,1),
            filter 0.32s cubic-bezier(0.33,1,0.68,1);
        }
        .dock-app.hovered {
          transform: scale(1.22) translateY(-12px);
          z-index: 2;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.14));
        }
        .dock-app.neighbor {
          transform: scale(1.09) translateY(-6px);
          z-index: 1;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.08));
        }
        .dock-app:not(.hovered):not(.neighbor) {
          z-index: 0;
          filter: none;
        }
      `}</style>
      {applications.map((app, idx) => {
        const isOpen = openApps.includes(app.name) || minimizedApps.includes(app.name);
        let classNames = "dock-app flex flex-col items-center cursor-pointer";
        if (hoveredIdx === idx) classNames += " hovered";
        else if (hoveredIdx !== null && (idx === hoveredIdx - 1 || idx === hoveredIdx + 1)) classNames += " neighbor";
        return (
          <span
            key={app.name}
            className={classNames}
            style={{ position: 'relative', minWidth: 48 }}
            onClick={() => {
              setApplication(app.name);
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
              // If app is minimized, restore it
              if (minArr.includes(app.name)) {
                minArr = minArr.filter((a) => a !== app.name);
                if (!arr.includes(app.name)) arr.unshift(app.name);
                // Remove from minimized, add to current
                localStorage.setItem("currentApplication", JSON.stringify(arr));
                localStorage.setItem("minimizedApplication", JSON.stringify(minArr));
                window.dispatchEvent(new Event("applicationChange"));
                return;
              }
              // If app is already the frontmost in currentApplication, minimize it
              if (arr.length > 0 && arr[0] === app.name) {
                // Remove from current, add to minimized
                arr = arr.filter((a) => a !== app.name);
                if (!minArr.includes(app.name)) minArr.unshift(app.name);
                localStorage.setItem("currentApplication", JSON.stringify(arr));
                localStorage.setItem("minimizedApplication", JSON.stringify(minArr));
                window.dispatchEvent(new Event("applicationChange"));
                return;
              }
              // Normal open: move to front of current
              arr = arr.filter((a) => a !== app.name);
              arr.unshift(app.name);
              // Ensure app is not in both arrays
              minArr = minArr.filter((a) => a !== app.name);
              localStorage.setItem("currentApplication", JSON.stringify(arr));
              localStorage.setItem("minimizedApplication", JSON.stringify(minArr));
              window.dispatchEvent(new Event("applicationChange"));
            }}
          >
            <Image
              src={app.logo}
              alt={app.label}
              width={48}
              height={48}
              className="rounded-lg"
            />
            {isOpen && (
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: -5,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#D9D9D9',
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Dock;
