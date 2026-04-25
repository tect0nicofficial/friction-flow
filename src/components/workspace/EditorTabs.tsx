import { X } from "lucide-react";
import { WorkspaceFile } from "../../types";
import { getLanguageDefinition } from "../../lib/workspace";
import { cn } from "../../lib/utils";

export function EditorTabs({
  activeTabId,
  tabs,
  onOpenFile,
  onCloseTab,
}: {
  activeTabId: string;
  tabs: WorkspaceFile[];
  onOpenFile: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}) {
  return (
    <div className="scrollbar-hidden flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-[#2d2d2d] bg-[#2d2d2d]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const badge = getLanguageDefinition(tab.languageId).badge;

        return (
          <div
            key={tab.id}
            className={cn(
              "group flex h-full min-w-40 items-center gap-2 border-r border-[#2d2d2d] px-3 text-[#cccccc] transition-colors",
              isActive
                ? "border-t border-t-[#007acc] bg-[#1e1e1e] shadow-[0_1px_0_#1e1e1e]"
                : "bg-[#2d2d2d] hover:bg-[#333333]",
            )}
          >
            <button
              type="button"
              onClick={() => onOpenFile(tab.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5d061]">
                {badge}
              </span>
              <span className="truncate text-[13px]">{tab.name}</span>
            </button>
            <button
              type="button"
              onClick={() => onCloseTab(tab.id)}
              className="rounded-xs p-1 text-[#858585] opacity-0 transition-colors hover:bg-[#3c3c3c] hover:text-white group-hover:opacity-100"
              aria-label={`Close ${tab.name}`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
