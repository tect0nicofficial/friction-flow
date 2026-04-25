import { LanguageId, SidebarView, WorkspaceFile } from "../../types";
import { FilePromptMetadata } from "./types";
import { InfoPill } from "./sidebar/FileRow";
import { SidebarSection } from "./sidebar/SidebarSection";
import { ExplorerView } from "./sidebar/ExplorerView";
import { SearchView } from "./sidebar/SearchView";
import { AnalysisView } from "./sidebar/AnalysisView";
import { SettingsView } from "./sidebar/SettingsView";

export type WorkspaceSidebarProps = {
  activeView: SidebarView;
  activeTab?: WorkspaceFile;
  files: WorkspaceFile[];
  openTabs: WorkspaceFile[];
  sourceFiles: WorkspaceFile[];
  testFiles: WorkspaceFile[];
  newFileLanguageId: LanguageId;
  userContext: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenFile: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onAnalyze: () => void;
  onMarkSolutionAttempted: () => void;
  onUnlockSolution: () => void;
  onClear: () => void;
  onNewFileLanguageChange: (languageId: LanguageId) => void;
  onUserContextChange: (value: string) => void;
  onCreateFile: () => void;
  filePromptMetadata: FilePromptMetadata | null;
};

export function WorkspaceSidebar({
  activeView,
  activeTab,
  files,
  openTabs,
  sourceFiles,
  testFiles,
  newFileLanguageId,
  userContext,
  searchQuery,
  onSearchQueryChange,
  onOpenFile,
  onCloseTab,
  onAnalyze,
  onMarkSolutionAttempted,
  onUnlockSolution,
  onClear,
  onNewFileLanguageChange,
  onUserContextChange,
  onCreateFile,
  filePromptMetadata,
}: WorkspaceSidebarProps) {
  const headerStatus = activeTab
    ? `${activeTab.name} · ${activeTab.languageLabel}`
    : "No file open";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#252526]">
      <div className="border-b border-[#3c3c3c] px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">
              FrictionFlow
            </div>
            <div className="mt-1 text-[12px] text-[#858585]">
              {headerStatus}
            </div>
          </div>
          <div className="rounded-full border border-[#3c3c3c] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#cccccc]">
            AI workspace
          </div>
        </div>
        <div className="mt-2.5 flex gap-2 overflow-hidden text-[11px] text-[#858585]">
          <InfoPill label="Open" value={String(openTabs.length)} />
          <InfoPill label="Files" value={String(files.length)} />
          <InfoPill label="Tests" value={String(testFiles.length)} />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
        <SidebarSection title="CONTEXT" defaultOpen>
          <div className="space-y-3 px-3 py-2.5">
            <div className="text-[12px] leading-relaxed text-[#858585]">
              Ask a question or add extra context before analysis.
            </div>
            <textarea
              value={userContext}
              onChange={(event) => onUserContextChange(event.target.value)}
              placeholder="For example: the bug only appears when the list is empty."
              rows={4}
              className="w-full resize-none rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-[13px] leading-normal text-[#d4d4d4] outline-none transition-colors placeholder:text-[#858585] focus:border-[#007acc]"
            />
          </div>
        </SidebarSection>

        {activeView === "explorer" ? (
          <ExplorerView
            activeTab={activeTab}
            openTabs={openTabs}
            sourceFiles={sourceFiles}
            testFiles={testFiles}
            newFileLanguageId={newFileLanguageId}
            onOpenFile={onOpenFile}
            onCloseTab={onCloseTab}
            onAnalyze={onAnalyze}
            onNewFileLanguageChange={onNewFileLanguageChange}
            onCreateFile={onCreateFile}
          />
        ) : null}

        {activeView === "search" ? (
          <SearchView
            files={files}
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
            onOpenFile={onOpenFile}
          />
        ) : null}

        {activeView === "analysis" ? (
          <AnalysisView
            activeTab={activeTab}
            filePromptMetadata={filePromptMetadata}
            onAnalyze={onAnalyze}
            onMarkSolutionAttempted={onMarkSolutionAttempted}
            onUnlockSolution={onUnlockSolution}
            onClear={onClear}
          />
        ) : null}

        {activeView === "settings" ? <SettingsView /> : null}
      </div>
    </div>
  );
}
