import { useEffect, useState } from "react";
import { Wifi, Search, SlidersHorizontal, BatteryIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import AboutDevicePopup from "./AboutDevicePopup";

interface StatusBarProps {
  application: string;
}

const leftMenu = [
  { key: "logo", type: "logo" },
  { key: "finder", label: "Finder" },
  { key: "file", label: "File" },
  { key: "edit", label: "Edit" },
  { key: "view", label: "View" },
  { key: "go", label: "Go" },
  { key: "window", label: "Window" },
  { key: "help", label: "Help" },
];

type BatteryManager = {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: () => void) => void;
};

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}

const getTimeString = () => {
  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = days[now.getDay()];
  const month = months[now.getMonth()];
  const date = now.getDate();
  let hour = now.getHours();
  const min = now.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${day} ${month} ${date} ${hour}:${min} ${ampm}`;
};

const logoPopupConfig = {
  partOne: [
    {
      key: "system",
      label: "System Info",
      render: () => (
        <div className="text-md w-fit">
          <span className="font-semibold whitespace-nowrap">
            Developer : Charvit
          </span>
        </div>
      ),
    },
    {
      key: "battery",
      label: "Battery",
      render: (battery: number) => (
        <div className="flex items-center gap-2 w-full text-xs">
          <BatteryIcon className="w-4 h-4" />
          <span>{battery}%</span>
        </div>
      ),
    },
  ],
  partTwo: [
    {
      key: "sleep",
      label: "Sleep",
      onClick: (closePopup: () => void) => {
        localStorage.setItem("loggedin", "false");
        window.dispatchEvent(new Event("logout"));
        closePopup();
      },
    },
    {
      key: "restart",
      label: "Restart...",
      onClick: (closePopup: () => void) => {
        localStorage.setItem("loggedin", "false");
        window.dispatchEvent(new Event("logout"));
        closePopup();
      },
    },
    {
      key: "shutdown",
      label: "Shut Down...",
      onClick: (closePopup: () => void) => {
        localStorage.setItem("loggedin", "false");
        window.dispatchEvent(new Event("logout"));
        closePopup();
      },
    },
  ],
};

const StatusBar = ({ application }: StatusBarProps) => {
  const [dateTime, setDateTime] = useState(getTimeString());
  const [battery, setBattery] = useState<number | null>(null);
  const [charging, setCharging] = useState<boolean>(false);
  const [logoPopupOpen, setLogoPopupOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const rightIcons = [
    {
      key: "battery",
      icon: BatteryIcon,
      tooltip: `Battery : ${battery}%`,
      className: "w-5 h-5 text-white",
      show: (battery: number | null) => battery !== null,
    },
    {
      key: "wifi",
      icon: Wifi,
      tooltip: "WiFi : Charvit",
      className: "w-5 h-5 text-white",
    },
    {
      key: "search",
      icon: Search,
      tooltip: "Search",
      className: "w-5 h-5 text-white",
    },
    {
      key: "control",
      icon: SlidersHorizontal,
      tooltip: "Control Center",
      className: "w-5 h-5 text-white",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => setDateTime(getTimeString()), 1000);
    if (navigator.getBattery) {
      navigator.getBattery().then((batt) => {
        setBattery(Math.round(batt.level * 100));
        setCharging(batt.charging);
        batt.addEventListener("levelchange", () =>
          setBattery(Math.round(batt.level * 100))
        );
        batt.addEventListener("chargingchange", () =>
          setCharging(batt.charging)
        );
      });
    }
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => setLogoPopupOpen((v) => !v);

  return (
    <TooltipProvider>
      <div className="w-full flex items-center justify-between px-4 py-1 bg-black/60 backdrop-blur-[2px] text-gray-100 text-sm fixed top-0 left-0 z-50 select-none">
        {/* Left Menu */}
        <ul className="flex gap-5 relative">
          {leftMenu.map((item, idx) => {
            if (item.type === "logo") {
              return (
                <li key="logo" className="relative">
                  <span
                    className="cursor-pointer flex items-center"
                    onClick={handleLogoClick}
                  >
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={18}
                      height={18}
                      className="rounded"
                    />
                  </span>
                  {logoPopupOpen && (
                    <div
                      className="absolute mt-3 z-50 bg-gray-100/10 border border-gray-200/10 backdrop-blur-[2px] rounded-xl p-1 shadow-xl animate-fade-in"
                      style={{ top: "100%" }}
                    >
                      {/* Part One: System details */}
                      {logoPopupConfig.partOne.map((item) => {
                        if (item.key === "about-device") return null;
                        return (
                          <div
                            key={item.key}
                            className="py-1 px-2 flex items-center justify-between"
                          >
                            {item.render(battery ?? 0)}
                          </div>
                        );
                      })}
                      {/* About Device Button (after battery, before partition) */}
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg bg-gray-100/10 hover:cursor-pointer hover:bg-gray-800/20 font-medium transition border border-gray-200/10 mt-1"
                        onClick={() => {
                          setLogoPopupOpen(false);
                          setAboutOpen(true);
                        }}
                      >
                        About Device
                      </button>
                      {/* Partition */}
                      <div className="my-2 h-px w-full bg-gray-300/30" />
                      {/* Part Two: Actions */}
                      {logoPopupConfig.partTwo.map((item) => (
                        <button
                          key={item.key}
                          className="w-full text-left px-3 py-2 rounded-lg bg-gray-100/10 hover:cursor-pointer hover:bg-gray-800/20 font-medium transition border border-gray-200/10 mb-1 last:mb-0"
                          onClick={() =>
                            item.onClick(() => setLogoPopupOpen(false))
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            }
            if (item.key === "finder") {
              return (
                <li
                  key={item.key}
                  className="hover:opacity-80 cursor-pointer font-semibold text-white"
                >
                  {application}
                </li>
              );
            }
            return (
              <li key={item.key} className="hover:opacity-80 cursor-pointer">
                {item.label}
              </li>
            );
          })}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {rightIcons.map(({ key, icon: Icon, tooltip, className, show }) => {
            if (!Icon) return null;
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <span>
                    <Icon className={className} />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-gray-300 text-black border border-gray-700"
                >
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            );
          })}
          <span className="ml-2 min-w-[120px] text-right">{dateTime}</span>
        </div>
      </div>
      {/* About Device Modal */}
      {aboutOpen && <AboutDevicePopup onClose={() => setAboutOpen(false)} />}
    </TooltipProvider>
  );
};

export default StatusBar;
