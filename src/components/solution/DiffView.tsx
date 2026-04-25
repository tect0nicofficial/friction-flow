import { cn } from "../../lib/utils";
import { type DiffRow } from "./diff-utils";

function DiffCell({
  lineNumber,
  text,
  kind,
  side,
}: {
  lineNumber: number | null;
  text: string;
  kind: DiffRow["kind"] | "empty";
  side: "old" | "new" | "left" | "right";
}) {
  const isRemoved = kind === "removed" && side === "old";
  const isAdded = kind === "added" && side === "new";
  const isEmpty = kind === "empty";

  return (
    <div
      className={cn(
        "grid grid-cols-[3.5rem_minmax(0,1fr)] gap-0 font-mono text-[14px] leading-[1.6]",
        kind === "same" && "bg-[#1e1e1e] text-[#d4d4d4]",
        isRemoved && "bg-[#51202A] text-[#f85149]",
        isAdded && "bg-[#204E26] text-[#3fb950]",
        isEmpty && "bg-[#1e1e1e] text-transparent",
      )}
    >
      <div className="select-none shrink-0 border-r border-[#3c3c3c] py-0 pr-3 text-right text-[14px] leading-[1.6] text-[#858585]">
        {lineNumber ?? "\u00a0"}
      </div>
      <div className="min-h-[1.6em] whitespace-pre-wrap break-all px-3 py-0">
        {text || "\u00a0"}
      </div>
    </div>
  );
}

export function DiffGrid({ rows }: { rows: DiffRow[] }) {
  return (
    <div className="scrollbar-hidden w-full flex-1 min-h-0 bg-[#1e1e1e] overflow-y-auto">
      <div className="flex flex-col min-w-0">
        <div className="flex border-b border-[#3c3c3c] bg-[#252526] text-[11px] font-semibold text-[#cccccc]">
          <div className="flex-1 border-r border-[#3c3c3c] px-3 py-1">
            Original
          </div>
          <div className="flex-1 px-3 py-1">Solution</div>
        </div>
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <div key={`${row.kind}-${index}`} className="flex flex-row w-full">
              <div className="flex-1 min-w-0 border-r border-[#3c3c3c]">
                {row.kind === "same" || row.kind === "removed" ? (
                  <DiffCell
                    lineNumber={row.oldLineNumber}
                    text={row.oldText}
                    kind={row.kind}
                    side="old"
                  />
                ) : (
                  <DiffCell
                    lineNumber={null}
                    text={""}
                    kind="empty"
                    side="left"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {row.kind === "same" || row.kind === "added" ? (
                  <DiffCell
                    lineNumber={row.newLineNumber}
                    text={row.newText}
                    kind={row.kind}
                    side="new"
                  />
                ) : (
                  <DiffCell
                    lineNumber={null}
                    text={""}
                    kind="empty"
                    side="right"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-center text-sm text-[#858585]">
            No changes.
          </div>
        )}
      </div>
    </div>
  );
}

export function StatPill({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 text-xs text-[#858585]",
        colorClass,
      )}
    >
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
}
