
import Folder from "@/components/Folder";
import File from "@/components/File";
import skillsData from "@/json/skills.json";
import { useState, useEffect, useRef } from "react";

interface SkillsProps {
  currentSubfolder?: string | null;
  onNavigateToSubfolder?: (subfolderName: string) => void;
  onNavigateBack?: () => void;
}

export default function Skills({ 
  currentSubfolder, 
  onNavigateToSubfolder, 
  onNavigateBack 
}: SkillsProps = {}) {
  const [clickedFolder, setClickedFolder] = useState<string | null>(null);
  // Remove local openedFolder state - use currentSubfolder from props instead
  const mainAreaRef = useRef<HTMLDivElement>(null);

  // Use currentSubfolder from props to determine if we're in a subfolder view

  // Deselect folder if clicking outside the selected folder (but don't navigate back from subfolder)
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
        // Don't call onNavigateBack here - only navigate back explicitly via keyboard or chevron
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
      if (currentSubfolder) {
        // In opened folder view, allow Back with Escape or ArrowLeft
        if (e.key === 'Escape' || e.key === 'ArrowLeft') {
          if (onNavigateBack) {
            onNavigateBack();
          }
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
        if (clickedFolder && onNavigateToSubfolder) {
          onNavigateToSubfolder(clickedFolder);
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [clickedFolder, currentSubfolder, skillsData, onNavigateToSubfolder, onNavigateBack]);

  // If a folder is opened (currentSubfolder), show its skills as File components
  if (currentSubfolder) {
    const folderObj = skillsData.find((cat: any) => cat.name.name === currentSubfolder);
    const files = folderObj?.skills || [];
    return (
      <div ref={mainAreaRef}>
        <div className="flex flex-wrap gap-6">
          {files.map((file: any) => (
            <div
              key={file.name}
              data-folder-name={currentSubfolder}
              style={{ display: "inline-block", height: "100%" }}
            >
              <File
                name={file.name}
                coverImage={file.coverImage || file.image}
                link={file.link}
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
          onDoubleClick={() => {
            setClickedFolder(category.name.name);
            if (onNavigateToSubfolder) {
              onNavigateToSubfolder(category.name.name);
            }
          }}
        >
          <Folder
            name={category.name.name}
            coverImage={category.name.coverImage}
            selected={clickedFolder === category.name.name}
            onSelect={() => setClickedFolder(category.name.name)}
            onDoubleClick={() => {
              setClickedFolder(category.name.name);
              if (onNavigateToSubfolder) {
                onNavigateToSubfolder(category.name.name);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
