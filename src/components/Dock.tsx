import { useEffect, useState } from "react";
import Image from "next/image";

interface DockProps {
  setApplication: (name: string) => void;
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
  },
  {
    name: "Safari",
    logo: "/apps/safari.png",
    label: "Safari",
  },
];

const Dock = ({ setApplication }: DockProps) => {
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

  return (
    <div className="flex bg-gray-100/10 backdrop-blur-[2px] gap-5 items-end justify-center p-2 rounded-xl">
      {applications.map((app) => {
        const isOpen = openApps.includes(app.name) || minimizedApps.includes(app.name);
        return (
          <span
            key={app.name}
            className="flex flex-col items-center cursor-pointer"
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
              // If app is minimized, move to current and remove from minimized
              if (minArr.includes(app.name)) {
                minArr = minArr.filter((a) => a !== app.name);
                if (!arr.includes(app.name)) arr.unshift(app.name);
              } else {
                // Normal open: move to front of current
                arr = arr.filter((a) => a !== app.name);
                arr.unshift(app.name);
              }
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
              className="rounded-lg transition-transform hover:scale-110"
            />
            {isOpen && (
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: -7,
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
