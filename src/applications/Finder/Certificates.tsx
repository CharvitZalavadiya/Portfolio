import File from "@/components/File";
import certificatesData from "@/json/certificates.json";
import { useState, useEffect, useRef } from "react";

export default function Certificates() {
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
      const popupEl = document.getElementById("certificates-popup");
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
      if (certificatesData.length === 0) return;
      if (popup) {
        if (e.key === "Escape") {
          setPopup(null);
          setClicked(popup);
          e.preventDefault();
        }
        return;
      }
      const idx = clicked
        ? certificatesData.findIndex((item: any) => item.name === clicked)
        : -1;
      if (e.key === "ArrowRight") {
        let nextIdx = idx + 1;
        if (nextIdx >= certificatesData.length) nextIdx = 0;
        setClicked(certificatesData[nextIdx].name);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = certificatesData.length - 1;
        setClicked(certificatesData[prevIdx].name);
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
  }, [clicked, popup, certificatesData]);

  const popupData = certificatesData.find((item: any) => item.name === popup);

  return (
    <div className="flex flex-wrap gap-6 p-4" ref={mainAreaRef}>
      {certificatesData.map((item: any) => (
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
          id="certificates-popup"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex items-center justify-center"
          onClick={() => {
            if (popup) setClicked(popup);
            setPopup(null);
          }}
        >
          <div
            className="bg-gray-100/10 rounded-xl p-0 relative shadow-lg w-fit max-w-[45dvw] max-h-[70dvh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Full cover image */}
            <div className="relative w-[35dvw] h-fit min-h-[240px] max-h-[60dvh]">
              <img
                src={popupData.coverImage}
                alt={popupData.name}
                className="w-full h-full object-cover"
                style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
            </div>
            {/* Name and Issuer below image */}
            <div className="flex flex-col justify-center py-2 px-3">
              <span className="text-xl font-bold mb-1">{popupData.name}</span>
              <span className="text-base font-semibold text-gray-400">{popupData.issuer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
