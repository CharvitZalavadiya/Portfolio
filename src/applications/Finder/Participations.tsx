import File from "@/components/File";
import participationsData from "@/json/participations.json";
import { useState, useEffect, useRef } from "react";

export default function Participations() {
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
      const popupEl = document.getElementById("participations-popup");
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
      if (participationsData.length === 0) return;
      if (popup) {
        if (e.key === "Escape") {
          setPopup(null);
          setClicked(popup);
          e.preventDefault();
        }
        return;
      }
      const idx = clicked
        ? participationsData.findIndex((item: any) => item.name === clicked)
        : -1;
      if (e.key === "ArrowRight") {
        let nextIdx = idx + 1;
        if (nextIdx >= participationsData.length) nextIdx = 0;
        setClicked(participationsData[nextIdx].name);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = participationsData.length - 1;
        setClicked(participationsData[prevIdx].name);
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
  }, [clicked, popup, participationsData]);

  const popupData = participationsData.find((item: any) => item.name === popup);

  return (
    <div className="flex flex-wrap gap-6" ref={mainAreaRef}>
      {participationsData.map((item: any) => (
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
          id="participations-popup"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={() => {
            if (popup) setClicked(popup);
            setPopup(null);
          }}
        >
          <div
            className="bg-gray-100/10 rounded-xl p-0 relative shadow-lg w-fit max-w-[45dvw] max-h-[70dvh] backdrop-blur-2xl"
            style={{ maxHeight: '70dvh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '70dvh' }}>
              {/* Top Section: Image left, Name & Date right (Experience style) */}
              <div className="flex flex-row bg-black/10 items-center gap-6 px-6 pt-2 pb-2">
                <img
                  src={popupData.coverImage}
                  alt={popupData.name}
                  className="w-20 h-20 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold leading-tight mb-1">{popupData.name}</span>
                  <span className="text-base font-medium text-gray-300 drop-shadow">{popupData.details.date}</span>
                </div>
              </div>
              {/* Bottom Section: Topic, Solution, Tech */}
              <div className="flex flex-col gap-4 px-6 py-6 bg-black/10 rounded-b-xl">
                {/* Topic */}
                {popupData.details.topic && (
                  <div>
                    <div className="text-base font-semibold text-gray-300 mb-1">Topic</div>
                    <div className="text-gray-400 text-sm">{popupData.details.topic}</div>
                  </div>
                )}
                {/* Solution */}
                {popupData.details.solution && popupData.details.solution.length > 0 && (
                  <div>
                    <div className="text-base font-semibold mb-1">Solution</div>
                    <ul className="list-disc ml-6 space-y-1 text-gray-400 text-sm">
                      {popupData.details.solution.map((point: string, idx: number) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Tech Stack */}
                {popupData.details.tech && popupData.details.tech.length > 0 && (
                  <div>
                    <div className="text-base font-semibold text-gray-300 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {popupData.details.tech.map((tech: string, idx: number) => (
                        <span key={idx} className="bg-gray-200/10 text-gray-400 px-2 py-1 rounded text-xs font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
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
