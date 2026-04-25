import { type ComponentType } from "react";
import {
  Compass,
  FileCode2,
  FileSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { SidebarView } from "../../types";
import { cn } from "../../lib/utils";

export function ActivityBar({
  activeView,
  isSidebarCollapsed,
  onChange,
  onToggleSidebar,
}: {
  activeView: SidebarView;
  isSidebarCollapsed: boolean;
  onChange: (view: SidebarView) => void;
  onToggleSidebar: () => void;
}) {
  const items: Array<{
    view: SidebarView;
    label: string;
    icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  }> = [
    { view: "explorer", label: "Explorer", icon: FileCode2 },
    { view: "search", label: "Search", icon: FileSearch },
    { view: "analysis", label: "Analysis", icon: Compass },
    { view: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex w-12 shrink-0 flex-col items-center border-r border-[#252526] bg-[#333333] py-3">
      <div className="flex flex-col items-center gap-3">
        {items.map(({ view, label, icon: Icon }) => {
          const active = activeView === view;

          return (
            <button
              key={view}
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => onChange(view)}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xs text-white transition-colors",
                active
                  ? "bg-[#1e1e1e] opacity-100 shadow-[inset_0_0_0_1px_#007acc]"
                  : "opacity-45 hover:bg-[#2a2d2e] hover:opacity-100",
              )}
            >
              <Icon size={22} strokeWidth={1.6} />
              {active ? (
                <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 bg-white" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 pt-3">
        <div className="h-px w-6 bg-[#3c3c3c]" />
        <button
          type="button"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          aria-pressed={isSidebarCollapsed}
          onClick={onToggleSidebar}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xs text-white transition-colors hover:bg-[#2a2d2e]",
            isSidebarCollapsed &&
              "bg-[#1e1e1e] shadow-[inset_0_0_0_1px_#007acc]",
          )}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={20} strokeWidth={1.6} />
          ) : (
            <PanelLeftClose size={20} strokeWidth={1.6} />
          )}
        </button>
      </div>
    </div>
  );
}
