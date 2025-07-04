import File from "@/components/File";
import organizationsData from "@/json/organizations.json";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Organizations() {
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
      const popupEl = document.getElementById("organizations-popup");
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
      if (organizationsData.length === 0) return;
      if (popup) {
        if (e.key === "Escape") {
          setPopup(null);
          setClicked(popup);
          e.preventDefault();
        }
        return;
      }
      const idx = clicked
        ? organizationsData.findIndex((item: { name: string }) => item.name === clicked)
        : -1;
      if (e.key === "ArrowRight") {
        let nextIdx = idx + 1;
        if (nextIdx >= organizationsData.length) nextIdx = 0;
        setClicked(organizationsData[nextIdx].name);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = organizationsData.length - 1;
        setClicked(organizationsData[prevIdx].name);
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

  const popupData = organizationsData.find((item: { name: string }) => item.name === popup);

  return (
    <div className="flex flex-wrap gap-6" ref={mainAreaRef}>
      {organizationsData.map((item: { name: string; coverImage: string }) => (
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
          id="organizations-popup"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={() => {
            if (popup) setClicked(popup);
            setPopup(null);
          }}
        >
          <div
            className="bg-gray-100/10 rounded-xl p-0 relative shadow-lg w-fit max-w-[45dvw] max-h-[70dvh]"
            style={{ maxHeight: '70dvh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '70dvh' }}>
              {/* Top Section: Image left, Name & Dates right */}
              <div className="flex flex-row items-center gap-6 px-6 pt-6 pb-2">
                <Image
                  src={popupData.coverImage}
                  alt={popupData.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full border-2 border-gray-100/50"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold leading-tight mb-1">{popupData.name}</span>
                  <span className="text-base font-medium text-gray-300 drop-shadow">
                    {popupData.details.position}
                  </span>
                  <span className="text-sm text-gray-400">
                    {popupData.details.startDate} - {popupData.details.endDate}
                  </span>
                </div>
              </div>
              {/* Bottom Section: Points */}
              <div className="flex flex-col gap-4 px-6 py-6 rounded-b-xl">
                {popupData.details.points && popupData.details.points.length > 0 && (
                  <div>
                    <div className="text-base font-semibold text-gray-300 mb-1">Highlights</div>
                    <ul className="list-disc ml-6 space-y-1 text-gray-200 text-sm">
                      {popupData.details.points.map((point: string, idx: number) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
