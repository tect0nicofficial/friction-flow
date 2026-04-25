import { FileCode2, FolderOpen, FileText, Play } from "lucide-react";
import { LanguageId, WorkspaceFile } from "../../../types";
import { supportedLanguages } from "../../../lib/workspace";
import { SidebarSection } from "./SidebarSection";
import { FileRow } from "./FileRow";
import { FileGroup } from "./FileGroup";

export function ExplorerView({
  activeTab,
  openTabs,
  sourceFiles,
  testFiles,
  newFileLanguageId,
  onOpenFile,
  onCloseTab,
  onAnalyze,
  onNewFileLanguageChange,
  onCreateFile,
}: {
  activeTab?: WorkspaceFile;
  openTabs: WorkspaceFile[];
  sourceFiles: WorkspaceFile[];
  testFiles: WorkspaceFile[];
  newFileLanguageId: LanguageId;
  onOpenFile: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onAnalyze: () => void;
  onNewFileLanguageChange: (languageId: LanguageId) => void;
  onCreateFile: () => void;
}) {
  return (
    <div className="space-y-1 pb-2.5">
      <SidebarSection title="NEW FILE" defaultOpen>
        <div className="space-y-3 px-3 py-2.5">
          <div className="text-[12px] leading-relaxed text-[#858585]">
            Create a source file and its matching test stub.
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="new-file-language"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70"
            >
              Language
            </label>
            <select
              id="new-file-language"
              value={newFileLanguageId}
              onChange={(event) =>
                onNewFileLanguageChange(event.target.value as LanguageId)
              }
              className="w-full rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-[13px] text-[#d4d4d4] outline-none transition-colors focus:border-[#007acc]"
            >
              {supportedLanguages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onCreateFile}
            className="flex w-full items-center justify-center gap-2 rounded-xs border border-[#0e639c] bg-[#0e639c] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#1177bb]"
          >
            <FileCode2 size={14} />
            Create source and test files
          </button>
        </div>
      </SidebarSection>

      <SidebarSection title="OPEN EDITORS" defaultOpen>
        <div className="px-2 pb-1.5 pt-1.5">
          <div className="space-y-1">
            {openTabs.map((file) => (
              <div key={file.id}>
                <FileRow
                  file={file}
                  active={file.id === activeTab?.id}
                  onOpen={() => onOpenFile(file.id)}
                  onClose={() => onCloseTab(file.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title="WORKSPACE" defaultOpen>
        <div className="space-y-3 px-2 pb-1.5 pt-1.5">
          <FileGroup
            title="Source files"
            icon={FolderOpen}
            files={sourceFiles}
            activeTabId={activeTab?.id}
            onOpenFile={onOpenFile}
          />

          <FileGroup
            title="Generated tests"
            icon={FileText}
            files={testFiles}
            activeTabId={activeTab?.id}
            onOpenFile={onOpenFile}
          />

          <button
            type="button"
            onClick={onAnalyze}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xs border border-[#0e639c] bg-[#0e639c] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#1177bb]"
          >
            <Play size={14} fill="currentColor" />
            Run analysis on {activeTab?.name ?? "active file"}
          </button>
        </div>
      </SidebarSection>

      <SidebarSection title="ACTIVE FILE" defaultOpen={Boolean(activeTab)}>
        <div className="px-3 py-2 text-[13px] leading-relaxed text-[#cccccc]">
          {activeTab ? (
            <div className="space-y-2 rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">
                  {activeTab.name}
                </span>
                <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#9cdcfe]">
                  {activeTab.languageLabel}
                </span>
              </div>
              <div className="text-[12px] text-[#858585]">{activeTab.path}</div>
              <div className="text-[12px] text-[#858585]">
                {activeTab.kind === "test"
                  ? "Generated companion test file"
                  : "Source file with generated test template"}
              </div>
            </div>
          ) : (
            <div className="rounded-xs border border-dashed border-[#3c3c3c] px-3 py-4 text-center text-[#858585]">
              Open a file to inspect it here.
            </div>
          )}
        </div>
      </SidebarSection>
    </div>
  );
}
