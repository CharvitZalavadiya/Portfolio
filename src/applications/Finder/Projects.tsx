import File from "@/components/File";
import projectsData from "@/json/projects.json";
import { useState, useEffect, useRef } from "react";

export default function Projects() {
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
      const popupEl = document.getElementById("projects-popup");
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
      if (projectsData.length === 0) return;
      if (popup) {
        if (e.key === "Escape") {
          setPopup(null);
          setClicked(popup);
          e.preventDefault();
        }
        return;
      }
      const idx = clicked
        ? projectsData.findIndex((item: any) => item.name === clicked)
        : -1;
      if (e.key === "ArrowRight") {
        let nextIdx = idx + 1;
        if (nextIdx >= projectsData.length) nextIdx = 0;
        setClicked(projectsData[nextIdx].name);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = projectsData.length - 1;
        setClicked(projectsData[prevIdx].name);
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
  }, [clicked, popup, projectsData]);

  const popupData = projectsData.find((item: any) => item.name === popup);

  return (
    <div className="flex flex-wrap gap-6" ref={mainAreaRef}>
      {projectsData.map((item: any) => (
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
          id="projects-popup"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={() => {
            if (popup) setClicked(popup);
            setPopup(null);
          }}
        >
          <div
            className="bg-gray-100/10 rounded-xl p-0 relative shadow-lg w-fit h-fit max-w-[45dvw] max-h-[65dvh] overflow-y-auto backdrop-blur-2xl"
            onClick={e => e.stopPropagation()}
          >
            {popupData.details && (
              <div className="flex flex-col">
                {/* Top Section: Base Image, Gradient, Name, Dates */}
                <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={popupData.details.baseImage || popupData.coverImage}
                    alt={popupData.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute left-0 right-0 bottom-0 px-6 pb-3 pt-8 flex flex-col items-start z-10">
                    <span className="text-2xl font-bold drop-shadow mb-1">{popupData.name}</span>
                    <span className="text-base font-medium text-gray-400 drop-shadow">
                      {popupData.details.startDate} - {popupData.details.endDate}
                    </span>
                  </div>
                </div>
                {/* Bottom Section: Links, Points, Tech */}
                <div className="flex flex-col gap-4 px-6 py-6 bg-black/10 rounded-b-xl">
                  {/* Links */}
                  <div className="flex gap-3 mb-2">
                    {popupData.details.githubUrl && (
                      <a
                        href={popupData.details.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1 rounded-full font-semibold text-xs shadow border border-gray-400/30 hover:bg-gray-400/10 transition"
                      >
                        GitHub
                      </a>
                    )}
                    {popupData.details.projectUrl && (
                      <a
                        href={popupData.details.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1 rounded-full font-semibold text-xs shadow bg-gray-200/10 hover:bg-gray-200/20 transition"
                      >
                        Live Project
                      </a>
                    )}
                  </div>
                  {/* Highlights */}
                  {popupData.details.points && popupData.details.points.length > 0 && (
                    <div>
                      <div className="text-base font-semibold text-gray-300 mb-1">Highlights</div>
                      <ul className="list-disc ml-4 space-y-1 text-gray-200 text-sm">
                        {popupData.details.points.map((point: string, i: number) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Tech Stack */}
                  {popupData.details.tech && popupData.details.tech.length > 0 && (
                    <div>
                      <div className="text-base font-semibold text-gray-300 mb-2">Tech Stack</div>
                      <div className="flex flex-wrap gap-2">
                        {popupData.details.tech.map((tech: string, i: number) => (
                          <span key={i} className="bg-gray-200/10 text-gray-400 px-2 py-1 rounded text-xs font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
