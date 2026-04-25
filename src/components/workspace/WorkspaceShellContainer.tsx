import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { WorkspaceEditor } from "./WorkspaceEditor";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { ActivityBar } from "./ActivityBar";
import { useWorkspaceState } from "./useWorkspaceState";

export default function WorkspaceShellContainer() {
  const {
    files,
    openTabs,
    activeTab,
    sourceFiles,
    testFiles,
    activeSidebarView,
    isSidebarCollapsed,
    searchQuery,
    newFileLanguageId,
    userContext,
    filePromptMetadata,
    sidebarPanelRef,
    setIsSidebarCollapsed,
    setSearchQuery,
    setNewFileLanguageId,
    setUserContext,
    openFile,
    closeTab,
    setActiveFileCode,
    clearActiveTabState,
    markSolutionAttempted,
    handleAnalyze,
    handleUnlockSolution,
    handleSidebarViewChange,
    handleSidebarToggle,
    createNewFile,
  } = useWorkspaceState();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1e1e1e] text-[#cccccc] font-sans text-[13px] select-none">
      <ActivityBar
        activeView={activeSidebarView}
        isSidebarCollapsed={isSidebarCollapsed}
        onChange={handleSidebarViewChange}
        onToggleSidebar={handleSidebarToggle}
      />

      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0">
        <ResizablePanel
          panelRef={sidebarPanelRef}
          defaultSize={24}
          minSize={18}
          collapsedSize={0}
          collapsible
          onResize={({ asPercentage }) => {
            setIsSidebarCollapsed(asPercentage <= 0.5);
          }}
          className="flex min-w-0 flex-col border-r border-[#3c3c3c] bg-[#252526] overflow-hidden"
        >
          {isSidebarCollapsed ? null : (
            <WorkspaceSidebar
              activeView={activeSidebarView}
              activeTab={activeTab}
              files={files}
              openTabs={openTabs}
              sourceFiles={sourceFiles}
              testFiles={testFiles}
              newFileLanguageId={newFileLanguageId}
              userContext={userContext}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onOpenFile={openFile}
              onCloseTab={closeTab}
              onAnalyze={handleAnalyze}
              onMarkSolutionAttempted={markSolutionAttempted}
              onUnlockSolution={handleUnlockSolution}
              onClear={clearActiveTabState}
              onNewFileLanguageChange={setNewFileLanguageId}
              onUserContextChange={setUserContext}
              onCreateFile={createNewFile}
              filePromptMetadata={filePromptMetadata}
            />
          )}
        </ResizablePanel>

        <ResizableHandle className="w-0.5 bg-[#2a2a2a] hover:bg-[#007acc] transition-colors data-resize-active:bg-[#007acc]" />

        <ResizablePanel
          defaultSize={76}
          minSize={45}
          className="flex min-w-0 flex-col bg-[#1e1e1e]"
        >
          <WorkspaceEditor
            activeTab={activeTab}
            openTabs={openTabs}
            onOpenFile={openFile}
            onCloseTab={closeTab}
            onChangeCode={setActiveFileCode}
            solutionText={activeTab?.solutionText ?? null}
            canUnlock={Boolean(activeTab?.analysis)}
            hasTriedSolution={Boolean(activeTab?.hasTriedSolution)}
            isLoading={Boolean(activeTab?.isSolutionLoading)}
            onMarkSolutionAttempted={markSolutionAttempted}
            onUnlock={handleUnlockSolution}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
