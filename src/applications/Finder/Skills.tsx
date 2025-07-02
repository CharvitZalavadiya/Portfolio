
import Folder from "@/components/Folder";
import File from "@/components/File";
import skillsData from "@/json/skills.json";
import { useState, useEffect, useRef } from "react";

export default function Skills() {
  const [clickedFolder, setClickedFolder] = useState<string | null>(null);
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);

  // Deselect folder if clicking outside the selected or opened folder
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!clickedFolder && !openedFolder) return;
      const folderElements = document.querySelectorAll('[data-folder-name]');
      let clickedInside = false;
      folderElements.forEach((el) => {
        if (
          (el.getAttribute('data-folder-name') === clickedFolder || el.getAttribute('data-folder-name') === openedFolder) &&
          el.contains(e.target as Node)
        ) {
          clickedInside = true;
        }
      });
      if (!clickedInside) {
        setClickedFolder(null);
        setOpenedFolder(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [clickedFolder, openedFolder]);

  // Keyboard navigation for folder selection (focus only when Skills is visible)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if Skills is visible in the DOM
      if (!mainAreaRef.current || document.activeElement?.tagName === 'INPUT') return;
      if (skillsData.length === 0) return;
      if (openedFolder) {
        // In opened folder view, allow Back with Escape or ArrowLeft
        if (e.key === 'Escape' || e.key === 'ArrowLeft') {
          setOpenedFolder(null);
          setClickedFolder(null);
          e.preventDefault();
        }
        return;
      }
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
        if (clickedFolder) {
          setOpenedFolder(clickedFolder);
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [clickedFolder, openedFolder, skillsData]);

  // Top bar: show navigation path
  const renderTopBar = () => {
    if (openedFolder) {
      return (
        <div className="flex items-center gap-2 mb-4">
          <button
            className="px-2 py-1 rounded hover:bg-gray-200/20 text-xs border border-gray-300/20 mr-2"
            onClick={() => {
              setOpenedFolder(null);
              setClickedFolder(null);
            }}
          >
            Back
          </button>
          <span className="text-sm font-medium">Skills &gt; {openedFolder}</span>
        </div>
      );
    }
    return (
      <div className="mb-4 text-sm font-medium">Skills</div>
    );
  };

  // If a folder is opened, show its skills as File components
  if (openedFolder) {
    const folderObj = skillsData.find((cat: any) => cat.name.name === openedFolder);
    const files = folderObj?.skills || [];
    return (
      <div ref={mainAreaRef}>
        {renderTopBar()}
        <div className="flex flex-wrap gap-6">
          {files.map((file: any) => (
            <div
              key={file.name}
              data-folder-name={openedFolder}
              style={{ display: "inline-block", height: "100%" }}
            >
              <File
                name={file.name}
                coverImage={file.coverImage || file.image}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Otherwise, show the folder grid
  return (
    <div className="flex flex-wrap gap-6" ref={mainAreaRef}>
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
          tabIndex={-1}
          onMouseDown={e => e.preventDefault()}
          onClick={() => setClickedFolder(category.name.name)}
          onDoubleClick={() => setOpenedFolder(category.name.name)}
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
