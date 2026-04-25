import { type ComponentType } from "react";
import { Code2, FileText, X } from "lucide-react";
import { WorkspaceFile } from "../../../types";
import { cn } from "../../../lib/utils";
import { getLanguageDefinition } from "../../../lib/workspace";

export function FileRow({
  file,
  active,
  onOpen,
  onClose,
}: {
  file: WorkspaceFile;
  active: boolean;
  onOpen: () => void;
  onClose?: () => void;
}) {
  const badge = getLanguageDefinition(file.languageId).badge;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-xs border px-2 py-1.5 transition-colors",
        active
          ? "border-[#007acc] bg-[#1f2937] text-white shadow-[inset_0_0_0_1px_rgba(0,122,204,0.25)]"
          : "border-transparent bg-transparent hover:border-[#3c3c3c] hover:bg-[#242424]",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        {file.kind === "test" ? (
          <FileText size={13} className="shrink-0 text-[#9cdcfe]" />
        ) : (
          <Code2 size={13} className="shrink-0 text-[#f5d061]" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px]">{file.name}</div>
          <div className="truncate text-[11px] text-[#858585]">{file.path}</div>
        </div>
        <span className="shrink-0 rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#9cdcfe]">
          {badge}
        </span>
      </button>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-xs p-1 text-[#858585] opacity-0 transition-colors hover:bg-[#3c3c3c] hover:text-white group-hover:opacity-100"
          aria-label={`Close ${file.name}`}
        >
          <X size={12} />
        </button>
      ) : null}
    </div>
  );
}

export function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#858585]">
      {value} {label}
    </div>
  );
}

export function StatusRow({
  icon: Icon,
  iconClassName,
  label,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClassName?: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className={iconClassName} />
      <span>{label}</span>
    </div>
  );
}
