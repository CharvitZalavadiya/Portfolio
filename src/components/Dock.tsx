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

const Dock = ({ setApplication }: DockProps) => (
  <div className="flex bg-gray-100/10 backdrop-blur-[2px] gap-5 items-end justify-center p-2 rounded-xl">
    {applications.map((app) => (
      <span
        key={app.name}
        className="flex flex-col items-center cursor-pointer"
        onClick={() => {
          setApplication(app.name);
          // Get current array from localStorage
          let arr: string[] = [];
          try {
            arr = JSON.parse(localStorage.getItem("currentApplication") || "[]");
            if (!Array.isArray(arr)) arr = [];
          } catch {
            arr = [];
          }
          // Remove if already present
          arr = arr.filter((a) => a !== app.name);
          // Add to front
          arr.unshift(app.name);
          // Save back
          localStorage.setItem("currentApplication", JSON.stringify(arr));
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
      </span>
    ))}
  </div>
);

export default Dock;
