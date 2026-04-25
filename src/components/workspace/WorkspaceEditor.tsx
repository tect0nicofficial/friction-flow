import { useMemo, useRef } from "react";
import { Unlock } from "lucide-react";
import { EditorView } from "@codemirror/view";
import { WorkspaceFile } from "../../types";
import { parseSolutionText } from "../../lib/solution";
import { SolutionDiff } from "../SolutionDiff";
import { cn } from "../../lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { CodeMirrorEditor } from "./CodeMirrorEditor";
import { EditorTabs } from "./EditorTabs";
import { MobileDeviceBanner } from "./MobileDeviceBanner";

export type WorkspaceEditorProps = {
  activeTab?: WorkspaceFile;
  openTabs: WorkspaceFile[];
  onOpenFile: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onChangeCode: (code: string) => void;
  solutionText: string | null;
  canUnlock: boolean;
  hasTriedSolution: boolean;
  isLoading: boolean;
  onMarkSolutionAttempted: () => void;
  onUnlock: () => void;
};

export function WorkspaceEditor({
  activeTab,
  openTabs,
  onOpenFile,
  onCloseTab,
  onChangeCode,
  solutionText,
  canUnlock,
  hasTriedSolution,
  isLoading,
  onMarkSolutionAttempted,
  onUnlock,
}: WorkspaceEditorProps) {
  const editorViewRef = useRef<EditorView | null>(null);
  const parsedSolution = useMemo(
    () => parseSolutionText(solutionText),
    [solutionText],
  );

  const handleAcceptSolution = () => {
    if (!parsedSolution.hasCodeFence || !parsedSolution.code.trim()) {
      return;
    }

    onChangeCode(parsedSolution.code);

    requestAnimationFrame(() => {
      editorViewRef.current?.focus();
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
      <MobileDeviceBanner />
      <EditorTabs
        activeTabId={activeTab?.id ?? ""}
        tabs={openTabs}
        onOpenFile={onOpenFile}
        onCloseTab={onCloseTab}
      />

      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#3c3c3c] bg-[#252526] px-3">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#858585]">
          <span>{activeTab?.name ?? "No file open"}</span>
          {activeTab ? <span>{activeTab.languageLabel}</span> : null}
          {parsedSolution.summary ? (
            <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[#9cdcfe] tracking-[0.16em]">
              Solution ready
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAcceptSolution}
          disabled={!parsedSolution.hasCodeFence || !parsedSolution.code.trim()}
          className={cn(
            "inline-flex items-center gap-2 rounded-xs border border-[#3c3c3c] px-3 py-1.5 text-[12px] font-medium text-[#d4d4d4] transition-colors hover:border-[#007acc] hover:bg-[#2a2d2e] hover:text-white",
            (!parsedSolution.hasCodeFence || !parsedSolution.code.trim()) &&
              "cursor-not-allowed opacity-40 hover:border-[#3c3c3c] hover:bg-transparent hover:text-[#d4d4d4]",
          )}
        >
          <Unlock size={13} />
          Accept solve
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[#1e1e1e]">
        {activeTab ? (
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-0 flex-1"
          >
            <ResizablePanel
              defaultSize={50}
              minSize={20}
              className="flex min-h-0 flex-col"
            >
              <CodeMirrorEditor
                code={activeTab.code}
                languageId={activeTab.languageId}
                onChangeCode={onChangeCode}
                editorViewRef={editorViewRef}
              />
            </ResizablePanel>

            <ResizableHandle className="w-0.5 bg-[#2a2a2a] hover:bg-[#007acc] transition-colors data-resize-active:bg-[#007acc]" />

            <ResizablePanel
              defaultSize={50}
              minSize={20}
              className="flex min-h-0 flex-col"
            >
              <SolutionDiff
                originalCode={activeTab.code}
                solutionText={solutionText}
                canUnlock={canUnlock}
                hasTriedSolution={hasTriedSolution}
                isLoading={isLoading}
                onMarkSolutionAttempted={onMarkSolutionAttempted}
                onUnlock={onUnlock}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-1 items-center justify-center text-[#858585]">
            No editor tab is active.
          </div>
        )}
      </div>
    </div>
  );
}
