import File from "@/components/File";
import experienceData from "@/json/experience.json";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Experience() {
  const [clicked, setClicked] = useState<string | null>(null);
  const [popup, setPopup] = useState<string | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);

  // Deselect file if clicking outside the selected file or popup
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!clicked && !popup) return;
      const fileElements = document.querySelectorAll("[data-file-name]");
      let clickedInside = false;
      fileElements.forEach((el) => {
        if (
          (el.getAttribute("data-file-name") === clicked ||
            el.getAttribute("data-file-name") === popup) &&
          el.contains(e.target as Node)
        ) {
          clickedInside = true;
        }
      });
      const popupEl = document.getElementById("experience-popup");
      if (popupEl && popupEl.contains(e.target as Node)) {
        clickedInside = true;
      }
      if (!clickedInside) {
        if (popup) setClicked(popup);
        setPopup(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [clicked, popup]);

  // Keyboard navigation for file selection and popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mainAreaRef.current || document.activeElement?.tagName === "INPUT")
        return;
      if (experienceData.length === 0) return;
      if (popup) {
        if (e.key === "Escape") {
          setPopup(null);
          setClicked(popup);
          e.preventDefault();
        }
        return;
      }
      const idx = clicked
        ? experienceData.findIndex((item: { name: string }) => item.name === clicked)
        : -1;
      if (e.key === "ArrowRight") {
        let nextIdx = idx + 1;
        if (nextIdx >= experienceData.length) nextIdx = 0;
        setClicked(experienceData[nextIdx].name);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = experienceData.length - 1;
        setClicked(experienceData[prevIdx].name);
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (clicked) {
          setPopup(clicked);
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [clicked, popup]);

  const popupData = experienceData.find((item: { name: string }) => item.name === popup);

  return (
    <div className="flex flex-wrap gap-6" ref={mainAreaRef}>
      {experienceData.map((item: { name: string; coverImage: string }) => (
        <div
          key={item.name}
          data-file-name={item.name}
          style={{ display: "inline-block", height: "100%" }}
          className={clicked === item.name ? "bg-gray-100/10 rounded-lg h-full" : ""}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setClicked(item.name)}
        >
          <File
            name={item.name}
            coverImage={item.coverImage}
            onDoubleClick={() => {
              setClicked(item.name);
              setPopup(item.name);
            }}
          />
        </div>
      ))}

      {/* Popup */}
      {popup && popupData && (
        <div
          id="experience-popup"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={() => {
            if (popup) setClicked(popup);
            setPopup(null);
          }}
        >
          <div
            className="bg-gray-100/10 rounded-xl p-6 relative shadow-lg w-fit h-fit max-w-[45dvw] max-h-[65dvh] overflow-y-auto backdrop-blur-2xl"
            onClick={e => e.stopPropagation()}
          >
            {Array.isArray(popupData.details) && popupData.details.map((detail: { startingDate: string; endingDate: string; role: string; points: string[]; tech: string[] }, idx: number) => (
              <div key={idx} className="space-y-4 min-w-[300px]">
                {/* Row 1: Image and Name/Role */}
                <div className="flex gap-6 items-center">
                  <Image
                    src={popupData.coverImage}
                    alt={popupData.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain rounded-lg bg-transparent shadow"
                  />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold leading-tight">{popupData.name}</span>
                    <span className="text-lg font-medium text-gray-300 mt-1">{detail.role}</span>
                  </div>
                </div>
                {/* Row 2: Dates */}
                <div>
                  <span className="text-gray-400">{detail.startingDate} - {detail.endingDate}</span>
                </div>
                {/* Row 3: Highlights */}
                {detail.points && detail.points.length > 0 && (
                  <div>
                    <div className="text-base font-semibold mb-1">Highlights</div>
                    <ul className="list-disc ml-4 space-y-1 text-gray-400 text-sm">
                      {detail.points.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Row 4: Tech Stack */}
                {detail.tech && detail.tech.length > 0 && (
                  <div>
                    <div className="text-base font-semibold text-gray-300 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {detail.tech.map((tech: string, i: number) => (
                        <span key={i} className="bg-gray-200/10 text-gray-400 px-2 py-1 rounded text-xs font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
