

import Folder from "@/components/Folder";
import finderFolders from "@/json/FinderFolders.json";
import FinderSidebar from "./FinderSidebar";
import { useState, useRef, useEffect } from "react";

export default function Finder() {
  // Find all folder items, and the Macintosh HD item
  const allFolders = Object.values(finderFolders).flat();
  const macHD = allFolders.find((item: any) => item.name === "Macintosh HD");
  const otherFolders = allFolders.filter((item: any) => item.name !== "Macintosh HD");


  // State: selected folder, default to Macintosh HD
  const [selected, setSelected] = useState<string>("Macintosh HD");
  const [clickedFolder, setClickedFolder] = useState<string | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);


  // Folders to show: if Macintosh HD is selected, show all except Macintosh HD; else show only the selected folder
  const foldersToShow = selected === "Macintosh HD" ? otherFolders : otherFolders.filter((item: any) => item.name === selected);

  // Deselect folder if clicking outside the selected folder
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!clickedFolder) return;
      // Find the folder element for the selected folder
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

  // Keyboard navigation for folder selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (foldersToShow.length === 0) return;
      const idx = clickedFolder ? foldersToShow.findIndex((f: any) => f.name === clickedFolder) : -1;
      if (e.key === 'ArrowRight') {
        let nextIdx = idx + 1;
        if (nextIdx >= foldersToShow.length) nextIdx = 0;
        setClickedFolder(foldersToShow[nextIdx].name);
      } else if (e.key === 'ArrowLeft') {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = foldersToShow.length - 1;
        setClickedFolder(foldersToShow[prevIdx].name);
      } else if (e.key === 'Enter') {
        if (clickedFolder) {
          setSelected(clickedFolder);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clickedFolder, foldersToShow, setSelected]);

  // Keyboard navigation for folder selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (foldersToShow.length === 0) return;
      const idx = clickedFolder ? foldersToShow.findIndex((f: any) => f.name === clickedFolder) : -1;
      if (e.key === 'ArrowRight') {
        let nextIdx = idx + 1;
        if (nextIdx >= foldersToShow.length) nextIdx = 0;
        setClickedFolder(foldersToShow[nextIdx].name);
      } else if (e.key === 'ArrowLeft') {
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = foldersToShow.length - 1;
        setClickedFolder(foldersToShow[prevIdx].name);
      } else if (e.key === 'Enter') {
        if (clickedFolder) {
          setSelected(clickedFolder);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clickedFolder, foldersToShow, setSelected]);



  return (
    <div className="flex h-full w-full backdrop-blur-xl">
      {/* Sidebar */}
      <div className="min-w-[240px] max-w-[250px] mt-8">
        <FinderSidebar
          selected={selected}
          onSelect={setSelected}
        />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col" ref={mainAreaRef}>
        {/* ApplicationActions bar */}
        <div className="flex items-center bg-gray-500/15 h-10 p-2">
          <span className="ml-4 font-semibold text-base">{selected}</span>
        </div>
        {/* Folders/content area */}
        <div className="flex-1 p-4 bg-gray-500/20">
          <div className="flex flex-wrap gap-6">
            {foldersToShow.map((item: any) => (
              <div
                key={item.name}
                data-folder-name={item.name}
                style={{ display: "inline-block", height: "100%" }}
                className={
                  clickedFolder === item.name
                    ? "bg-gray-100/10 rounded-lg h-full"
                    : ""
                }
              >
                <Folder
                  name={item.name}
                  coverImage={item.icon}
                  selected={clickedFolder === item.name}
                  onSelect={() => {
                    setClickedFolder(item.name);
                  }}
                  onDoubleClick={() => {
                    setClickedFolder(item.name);
                    setSelected(item.name);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
