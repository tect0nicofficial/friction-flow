import { type ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function SidebarSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#3c3c3c]">
      <button
        type="button"
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-left transition-colors hover:bg-[#2a2d2e]"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? (
          <ChevronDown size={14} className="opacity-80" />
        ) : (
          <ChevronRight size={14} className="opacity-80" />
        )}
        <span className="flex-1 text-[11px] font-bold tracking-wide text-white opacity-80">
          {title}
        </span>
      </button>
      {isOpen ? <div className="pb-1.5">{children}</div> : null}
    </div>
  );
}
