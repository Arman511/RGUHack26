import React from "react";
import { Trash2, FolderOpen, FileText, Monitor } from "lucide-react";

export const DesktopIcons: React.FC = () => {
  const icons = [
    { icon: <Monitor size={28} />, label: "My Computer" },
    { icon: <Trash2 size={28} />, label: "Recycle Bin" },
    { icon: <FolderOpen size={28} />, label: "My Documents" },
    { icon: <FileText size={28} />, label: "README.txt" },
  ];

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-4">
      {icons.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1 w-16 cursor-pointer group"
        >
          <div className="text-primary-foreground drop-shadow-md group-hover:brightness-125">
            {item.icon}
          </div>
          <span className="text-[11px] text-primary-foreground text-center drop-shadow-md leading-tight px-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
