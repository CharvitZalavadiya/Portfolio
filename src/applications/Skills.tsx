import Folder from "@/components/Folder";
import skillsData from "@/json/skills.json";
import { useState, useEffect, useRef } from "react";

export default function Skills() {
  const [clickedFolder, setClickedFolder] = useState<string | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);

  // Deselect folder if clicking outside the selected folder
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!clickedFolder) return;
      const folderElements = document.querySelectorAll('[data-folder-name]');
      let clickedInside = false;
      folderElements.forEach((el) => {
        if (
          el.getAttribute('data-folder-name') === clickedFolder &&
          el.contains(e.target as Node)
        ) {
          clickedInside = true;
        }
      });
      if (!clickedInside) {
        setClickedFolder(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [clickedFolder]);

  // Keyboard navigation for folder selection (focus only when Skills is visible)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if Skills is visible in the DOM
      if (!mainAreaRef.current || document.activeElement?.tagName === 'INPUT') return;
      if (skillsData.length === 0) return;
      const idx = clickedFolder ? skillsData.findIndex((cat: any) => cat.name.name === clickedFolder) : -1;
      if (e.key === 'ArrowRight') {
        let nextIdx = idx + 1;
        if (nextIdx >= skillsData.length) nextIdx = 0;
        setClickedFolder(skillsData[nextIdx].name.name);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = skillsData.length - 1;
        setClickedFolder(skillsData[prevIdx].name.name);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        // Optionally handle enter
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [clickedFolder, skillsData]);

  return (
    <div className="flex flex-wrap gap-8 p-8" ref={mainAreaRef}>
      {skillsData.map((category: any) => (
        <div
          key={category.name.name}
          data-folder-name={category.name.name}
          style={{ display: "inline-block", height: "100%" }}
          className={
            clickedFolder === category.name.name
              ? "bg-gray-100/10 rounded-lg h-full"
              : ""
          }
          tabIndex={0}
          onClick={() => setClickedFolder(category.name.name)}
        >
          <Folder
            name={category.name.name}
            coverImage={category.name.coverImage}
            selected={clickedFolder === category.name.name}
            onSelect={() => setClickedFolder(category.name.name)}
          />
        </div>
      ))}
    </div>
  );
}
