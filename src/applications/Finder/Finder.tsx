import FinderSidebar from "./FinderSidebar";

export default function Finder() {
  return (
    <div className="flex h-full w-full backdrop-blur-xl">
      {/* Sidebar */}
      <div className="min-w-[150px] max-w-[250px] mt-8">
        <FinderSidebar />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* ApplicationActions bar */}
        <div className="flex items-center bg-gray-500/15 h-10 p-2">
          <span className="ml-4 font-semibold text-base">This is Finder</span>
        </div>
        {/* Folders/content area */}
        <div className="flex-1 p-4 bg-gray-500/20">Folders area</div>
      </div>
    </div>
  );
}
