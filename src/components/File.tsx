import Image from "next/image";

interface FileProps {
  name: string;
  coverImage: string;
  selected?: boolean;
  onSelect?: (name: string) => void;
  onDoubleClick?: (name: string) => void;
  link?: string; // URL to open when file is clicked
}

const File: React.FC<FileProps> = ({ name, coverImage, selected, onSelect, onDoubleClick, link }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(name);
    
    // If link is provided, open it in a new tab
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDoubleClick) onDoubleClick(name);
    
    // If link is provided, open it in a new tab
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`flex flex-col items-center w-24 hover:cursor-pointer hover:bg-gray-100/5 rounded-lg transition ${selected ? "bg-gray-100/10" : ""} select-none p-1`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={link ? `Click to open ${name} in new tab` : name}
    >
      <div className="relative w-16 h-14 flex items-center justify-center">
        {/* File base image */}
        <Image
          src="/finder/file.png"
          alt="File"
          width={64}
          height={56}
          style={{ objectFit: "contain" }}
        />
        {/* Cover image centered and grayscale */}
        <div className="absolute inset-0 top-2 flex items-center justify-center">
          <Image
            src={coverImage}
            alt={name + " icon"}
            width={30}
            height={30}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <span className="mt-2 text-xs text-center font-medium w-full select-none" title={name}>
        {name}
      </span>
    </div>
  );
};

export default File;
