import { type ComponentType } from "react";
import { WorkspaceFile } from "../../../types";
import { FileRow } from "./FileRow";

export function FileGroup({
  title,
  icon: Icon,
  files,
  activeTabId,
  onOpenFile,
}: {
  title: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  files: WorkspaceFile[];
  activeTabId?: string;
  onOpenFile: (fileId: string) => void;
}) {
  return (
    <div className="rounded-xs border border-[#3c3c3c] bg-[#1e1e1e]">
      <div className="flex items-center gap-2 border-b border-[#3c3c3c] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
        <Icon size={13} />
        {title}
      </div>
      <div className="space-y-1 p-1.5">
        {files.map((file) => (
          <div key={file.id}>
            <FileRow
              file={file}
              active={file.id === activeTabId}
              onOpen={() => onOpenFile(file.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
