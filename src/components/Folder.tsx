import Image from "next/image";


interface FolderProps {
  name: string;
  coverImage: string;
  selected?: boolean;
  onSelect?: (name: string) => void;
  onDoubleClick?: (name: string) => void;
}

const Folder: React.FC<FolderProps> = ({ name, coverImage, selected, onSelect, onDoubleClick }) => {
  return (
    <div
      className={`flex flex-col items-center w-24 hover:cursor-pointer hover:bg-gray-100/5 rounded-lg transition ${selected ? "bg-gray-100/10" : ""} select-none p-1`}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(name);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (onDoubleClick) onDoubleClick(name);
      }}
    >
      <div className="relative w-16 h-14 flex items-center justify-center">
        {/* Folder base image */}
        <Image
          src="/finder/folder.png"
          alt="Folder"
          width={64}
          height={56}
          style={{ objectFit: "contain" }}
        />
        {/* Cover image centered and grayscale */}
        <div className="absolute inset-0 top-2 opacity-70 flex items-center justify-center">
          <Image
            src={coverImage}
            alt={name + " icon"}
            width={24}
            height={24}
            style={{ objectFit: "contain", filter: "grayscale(1)" }}
          />
        </div>
      </div>
      <span className="mt-2 text-xs text-center font-medium w-full select-none" title={name}>
        {name}
      </span>
    </div>
  );
};

export default Folder;
