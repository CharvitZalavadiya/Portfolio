import File from "@/components/File";
import educationData from "@/json/education.json";
import { useState, useEffect, useRef } from "react";

export default function Education() {
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
      const popupEl = document.getElementById("education-popup");
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

  // Keyboard navigation for file selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mainAreaRef.current || document.activeElement?.tagName === "INPUT")
        return;
      if (educationData.length === 0) return;
      if (popup) {
        // If popup is open, handle ESC to close and restore clicked
        if (e.key === "Escape") {
          setPopup(null);
          setClicked(popup);
          e.preventDefault();
        }
        return;
      }
      const idx = clicked
        ? educationData.findIndex((item: { name: string }) => item.name === clicked)
        : -1;
      if (e.key === "ArrowRight") {
        let nextIdx = idx + 1;
        if (nextIdx >= educationData.length) nextIdx = 0;
        setClicked(educationData[nextIdx].name);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = educationData.length - 1;
        setClicked(educationData[prevIdx].name);
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

  // Popup content
  const popupData = educationData.find((item: { name: string }) => item.name === popup);

  return (
    <div className="flex flex-wrap gap-6" ref={mainAreaRef}>
      {educationData.map((item: { name: string; details: { passingYear: string; percentage: string; institution: string; location: string; specialization: string } }) => (
        <div
          key={item.name}
          data-file-name={item.name}
          style={{ display: "inline-block", height: "100%" }}
          className={
            clicked === item.name ? "bg-gray-100/10 rounded-lg h-full" : ""
          }
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setClicked(item.name)}
        >
          <File
            name={item.name}
            coverImage="/finder/textFile.png"
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
          id="education-popup"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={() => {
            setClicked(null);
            setPopup(null);
          }}
        >
          <div
            className="bg-gray-100/10 rounded-xl p-6 relative shadow-lg w-fit h-fit max-w-[90dvw] max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 text-2xl font-bold">{popupData.name}</div>
            <div className="space-y-1 text-gray-400">
              <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                <div className="font-semibold text-gray-300 col-span-1 w-fit">Specialization</div>
                <div className="col-span-2 w-fit">{popupData.details.specialization}</div>
                <div className="font-semibold text-gray-300 col-span-1 w-fit">Passing Year</div>
                <div className="col-span-2 w-fit">{popupData.details.passingYear}</div>
                <div className="font-semibold text-gray-300 col-span-1 w-fit">Percentage</div>
                <div className="col-span-2 w-fit">{popupData.details.percentage}</div>
                <div className="font-semibold text-gray-300 col-span-1 w-fit">Institution</div>
                <div className="col-span-2 w-fit">{popupData.details.institution}</div>
                <div className="font-semibold text-gray-300 col-span-1 w-fit">Location</div>
                <div className="col-span-2 w-fit">{popupData.details.location}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
