import Folder from "@/components/Folder";
import finderFolders from "@/json/FinderFolders.json";
import FinderSidebar from "./FinderSidebar";
// Remove static imports for dynamic folder rendering
// Dynamically import all folder UIs as needed
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
  // State for subfolder navigation
  const [currentSubfolder, setCurrentSubfolder] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);


  // Reset subfolder state when main folder selection changes
  useEffect(() => {
    setCurrentSubfolder(null);
    setNavigationHistory([]);
  }, [selected]);

  // Folders to show: if Macintosh HD is selected, show all except Macintosh HD; else show only the selected folder
  const foldersToShow = selected === "Macintosh HD" ? otherFolders : otherFolders.filter((item: any) => item.name === selected);

  // Deselect folder if clicking outside the selected folder (only when showing folder grid)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't handle click outside detection if we're showing a folder component (like Skills)
      if (selected !== "Macintosh HD" || !clickedFolder) return;
      
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
  }, [clickedFolder, selected]);

  // Keyboard navigation for folder selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle navigation if we're in a subfolder
      if (currentSubfolder) return;
      
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
  }, [clickedFolder, foldersToShow, setSelected, currentSubfolder]);



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
          {/* Left chevron for going back */}
          <button
            className={`mr-2 px-2 py-1 rounded hover:bg-gray-300/20 text-xs ${
              currentSubfolder ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => {
              if (currentSubfolder) {
                setCurrentSubfolder(null);
                setNavigationHistory([]);
              }
            }}
            disabled={!currentSubfolder}
          >
            ←
          </button>
          
          {/* Right chevron for going forward (placeholder) */}
          <button
            className="mr-2 px-2 py-1 rounded hover:bg-gray-300/20 text-xs opacity-50 cursor-not-allowed"
            disabled={true}
          >
            →
          </button>
          
          <span className="ml-4 font-semibold text-base">
            {currentSubfolder ? `${selected} > ${currentSubfolder}` : selected}
          </span>
        </div>
        {/* Folders/content area */}
        <div className="flex-1 p-4 bg-gray-500/20">
          {(() => {
            // Map folder names to components
            // Only render a special component if it is actually imported and available
            // Dynamically import and render the selected folder component if it exists
            try {
              if (selected && selected !== "Macintosh HD") {
                // Convert folder name to valid import (replace spaces and dashes with nothing)
                const fileName = selected.replace(/[^a-zA-Z0-9]/g, "");
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const FolderComponent = require(`./${selected}`).default;
                
                // Pass navigation props to folder components that support subfolder navigation
                const navigationProps = {
                  currentSubfolder,
                  onNavigateToSubfolder: (subfolderName: string) => {
                    setCurrentSubfolder(subfolderName);
                    setNavigationHistory([...navigationHistory, subfolderName]);
                  },
                  onNavigateBack: () => {
                    setCurrentSubfolder(null);
                    setNavigationHistory([]);
                  }
                };
                
                return <FolderComponent {...navigationProps} />;
              }
            } catch (e) {
              // If not found, fall back to folder grid
            }
            return (
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
            );
          })()}
        </div>
      </div>
    </div>
  );
}
