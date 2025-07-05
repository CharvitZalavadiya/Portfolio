import React from "react";
import finderFolders from "@/json/FinderFolders.json";
import Image from "next/image";


interface FinderSidebarProps {
  selected: string;
  onSelect: (name: string) => void;
}

const FinderSidebar: React.FC<FinderSidebarProps> = ({ selected, onSelect }) => {
  return (
    <aside className="px-4 py-2 border-r border-t border-gray-400/10 h-full">
      {Object.entries(finderFolders).map(([section, items]) => (
        <div key={section} className="mb-6">
          <div className="font-bold mb-2 text-base">{section}</div>
          <ul className="w-full">
            {(items as Array<{ name: string; icon: string }>).map((item) => (
              <li
                key={item.name}
                className={`text-gray-200/70 py-1 rounded-lg cursor-pointer transition px-2 flex items-center gap-2 ${selected === item.name ? 'bg-gray-200/20 font-semibold text-white' : 'hover:bg-gray-200/10'}`}
                onClick={() => onSelect(item.name)}
              >
                <Image src={item.icon} alt={item.name} width={18} height={18} style={{ height: '1em', width: '1em', minWidth: 18, minHeight: 18, opacity: 0.8 }} />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default FinderSidebar;
