import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { parseSolutionText } from "../lib/solution";
import { buildDiffRows } from "./solution/diff-utils";
import { DiffGrid, StatPill } from "./solution/DiffView";
import { SolutionLock } from "./solution/SolutionLock";
import { MarkdownSummary } from "./solution/MarkdownSummary";

type SolutionDiffProps = {
  originalCode: string;
  solutionText: string | null;
  canUnlock: boolean;
  hasTriedSolution: boolean;
  isLoading: boolean;
  onMarkSolutionAttempted: () => void;
  onUnlock: () => void;
};

export function SolutionDiff({
  originalCode,
  solutionText,
  canUnlock,
  hasTriedSolution,
  isLoading,
  onMarkSolutionAttempted,
  onUnlock,
}: SolutionDiffProps) {
  const parsed = useMemo(() => parseSolutionText(solutionText), [solutionText]);
  const diff = useMemo(
    () => buildDiffRows(originalCode, parsed.code),
    [originalCode, parsed.code],
  );

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#1e1e1e]">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#3c3c3c] bg-[#252526] px-3 shadow-sm z-10">
        <div className="flex items-center text-[11px] font-semibold tracking-wider text-[#cccccc] uppercase gap-2">
          <span>AI Generated Diff</span>
        </div>
        <div className="flex items-center gap-1">
          <StatPill
            label="added"
            value={`+${diff.additions}`}
            colorClass="text-[#89d185]"
          />
          <StatPill
            label="removed"
            value={`-${diff.deletions}`}
            colorClass="text-[#f14c4c]"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#1e1e1e] relative">
        <AnimatePresence mode="popLayout">
          {solutionText && parsed.code ? (
            <motion.div
              layout
              key="diff-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col flex-1 h-full min-h-0"
            >
              {parsed.summary && (
                <div className="scrollbar-hidden shrink-0 max-h-[30%] overflow-y-auto border-b border-[#3c3c3c] bg-[#252526] px-3 py-2.5 text-[13px] text-[#cccccc] shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                  <div className="font-semibold mb-1 text-[#4daafc]">
                    Implementation details:
                  </div>
                  <MarkdownSummary content={parsed.summary} />
                </div>
              )}
              <DiffGrid rows={diff.rows} />
            </motion.div>
          ) : (
            <motion.div
              layout
              key="diff-empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-1 flex-col items-center justify-center p-8 m-auto inset-0 absolute h-full w-full"
            >
              <SolutionLock
                canUnlock={canUnlock}
                hasTriedSolution={hasTriedSolution}
                isLoading={isLoading}
                onMarkSolutionAttempted={onMarkSolutionAttempted}
                onUnlock={onUnlock}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
