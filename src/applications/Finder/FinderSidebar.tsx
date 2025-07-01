import React from "react";
import finderFolders from "@/json/FinderFolders.json";
import Image from "next/image";

const FinderSidebar: React.FC = () => {
  return (
    <aside className="px-4 pt-2 my-2 border-t border-gray-100/20 h-full">
      {Object.entries(finderFolders).map(([section, items]) => (
        <div key={section} className="mb-6">
          <div className="font-bold mb-2 text-base">{section}</div>
          <ul className="w-full">
            {(items as Array<{ name: string; icon: string }>).map((item) => (
              <li key={item.name} className="text-gray-200/70 py-1 hover:bg-gray-200/10 rounded-lg cursor-pointer transition px-2 flex items-center gap-2">
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
