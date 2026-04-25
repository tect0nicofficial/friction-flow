import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  Trash2,
  Unlock,
} from "lucide-react";
import { WorkspaceFile, type FrictionFlowState } from "../../../types";
import { cn } from "../../../lib/utils";
import { FilePromptMetadata } from "../types";
import { SidebarSection } from "./SidebarSection";
import { StatusRow } from "./FileRow";

export function AnalysisView({
  activeTab,
  filePromptMetadata,
  onAnalyze,
  onMarkSolutionAttempted,
  onUnlockSolution,
  onClear,
}: {
  activeTab?: WorkspaceFile;
  filePromptMetadata: FilePromptMetadata | null;
  onAnalyze: () => void;
  onMarkSolutionAttempted: () => void;
  onUnlockSolution: () => void;
  onClear: () => void;
}) {
  const state: FrictionFlowState | null = activeTab
    ? {
        currentAnalysis: activeTab.analysis,
        isAnalyzing: activeTab.isAnalyzing,
        isSolutionUnlocked: activeTab.isSolutionUnlocked,
        hasTriedSolution: activeTab.hasTriedSolution,
        error: activeTab.error,
      }
    : null;
  const isAnalyzing = state?.isAnalyzing ?? false;
  const hasAnalysis = Boolean(state?.currentAnalysis);
  const hasTriedSolution = state?.hasTriedSolution ?? false;
  const canRevealSolution = Boolean(state?.currentAnalysis) && hasTriedSolution;

  return (
    <div className="space-y-1 pb-2.5">
      <SidebarSection title="ANALYSIS STATUS" defaultOpen>
        <div className="space-y-3 px-3 py-2.5">
          {isAnalyzing ? (
            <StatusRow
              icon={Loader2}
              iconClassName="animate-spin text-[#4daafc]"
              label="Analyzing active file..."
            />
          ) : hasAnalysis ? (
            <StatusRow
              icon={CheckCircle2}
              iconClassName="text-[#89d185]"
              label="Analysis complete"
            />
          ) : state?.error ? (
            <StatusRow
              icon={AlertCircle}
              iconClassName="text-[#f14c4c]"
              label="Analysis failed"
            />
          ) : (
            <div className="text-[#858585]">
              Ready to analyze {activeTab?.name ?? "the active file"}
            </div>
          )}

          <button
            onClick={onAnalyze}
            disabled={!activeTab || isAnalyzing}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xs border border-transparent bg-[#0e639c] px-3 py-2 text-white transition-colors hover:bg-[#1177bb]",
              (!activeTab || isAnalyzing) &&
                "cursor-not-allowed opacity-50 hover:bg-[#0e639c]",
            )}
          >
            <Play size={14} fill="currentColor" className="mr-1" />
            Run analysis
          </button>

          <button
            onClick={onClear}
            className="w-full flex items-center justify-center gap-2 rounded-xs border border-transparent bg-[#313131] px-3 py-2 text-[#cccccc] transition-colors hover:bg-[#3c3c3c] hover:text-white"
          >
            <Trash2 size={14} />
            Clear active tab state
          </button>
        </div>
      </SidebarSection>

      <SidebarSection title="ANALYSIS NOTES" defaultOpen>
        <div className="px-3 py-2 text-[13px] leading-relaxed text-[#cccccc]">
          {state?.currentAnalysis ? (
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center gap-1 font-semibold text-white opacity-80">
                  <AlertCircle size={12} className="text-[#d7ba7d]" />
                  Summary
                </div>
                <div className="wrap-break-word text-[#d4d4d4]">
                  {state.currentAnalysis.interpretation}
                </div>
              </div>
              <div>
                <div className="mb-1 font-semibold text-white opacity-80">
                  Points of friction
                </div>
                <ul className="list-disc space-y-1 pl-4 text-[#ce9178]">
                  {state.currentAnalysis.friction_points.map((point, index) => (
                    <li key={`${index}-${point}`}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-semibold text-white opacity-80">
                  Suggested investigation path
                </div>
                <ol className="list-decimal space-y-1 pl-4 text-[#9cdcfe]">
                  {state.currentAnalysis.debug_steps.map((step, index) => (
                    <li key={`${index}-${step}`}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="rounded-xs border border-dashed border-[#3c3c3c] px-3 py-4 text-center text-[#858585]">
              Run analysis to populate the analysis notes.
            </div>
          )}
        </div>
      </SidebarSection>

      <SidebarSection title="IMPLEMENTATION" defaultOpen>
        <div className="space-y-3 px-3 py-2.5">
          <div className="rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
              Try first
            </div>
            <div className="mt-2 text-[12px] leading-relaxed text-[#858585]">
              Work through the analysis notes, change the code, and only unlock
              the fix when you want to compare.
            </div>
            <ol className="mt-3 list-decimal space-y-1 pl-4 text-[12px] text-[#9cdcfe]">
              <li>Read the summary and friction points.</li>
              <li>Make your own change in the editor.</li>
              <li>Come back here when you're stuck.</li>
            </ol>

            {canRevealSolution ? (
              <button
                onClick={onUnlockSolution}
                disabled={!state?.currentAnalysis || isAnalyzing}
                className={cn(
                  "mt-3 w-full flex items-center justify-center gap-2 rounded-xs border border-[#0e639c] bg-[#0e639c] px-3 py-2 text-white transition-colors hover:bg-[#1177bb]",
                  (!state?.currentAnalysis || isAnalyzing) &&
                    "cursor-not-allowed opacity-50 hover:bg-[#0e639c]",
                )}
              >
                <Unlock size={14} />
                Reveal fix
              </button>
            ) : (
              <button
                onClick={onMarkSolutionAttempted}
                disabled={!state?.currentAnalysis || isAnalyzing}
                className={cn(
                  "mt-3 w-full flex items-center justify-center gap-2 rounded-xs border border-[#3c3c3c] bg-[#252526] px-3 py-2 text-[#d4d4d4] transition-colors hover:border-[#007acc] hover:bg-[#2a2d2e] hover:text-white",
                  (!state?.currentAnalysis || isAnalyzing) &&
                    "cursor-not-allowed opacity-50 hover:border-[#3c3c3c] hover:bg-[#252526] hover:text-[#d4d4d4]",
                )}
              >
                I tried it
              </button>
            )}
          </div>

          <div className="rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-[12px] text-[#858585]">
            {filePromptMetadata ? (
              <div className="space-y-1">
                <div className="text-[#cccccc]">
                  {filePromptMetadata.fileName}
                </div>
                <div>{filePromptMetadata.languageLabel}</div>
                {filePromptMetadata.testFileName ? (
                  <div>Test companion: {filePromptMetadata.testFileName}</div>
                ) : null}
              </div>
            ) : (
              <div>No file selected.</div>
            )}
          </div>
        </div>
      </SidebarSection>
    </div>
  );
}
