import { useMemo, useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";
import { analyzeCode, getSolution } from "../../services/aiService";
import { LanguageId, SidebarView, WorkspaceFile } from "../../types";
import {
  createInitialWorkspace,
  createWorkspaceFilePair,
  getLanguageDefinition,
  type WorkspaceSeed,
} from "../../lib/workspace";
import { FilePromptMetadata } from "./types";

const defaultWorkspaceSeeds: WorkspaceSeed[] = [
  {
    sourceId: "1",
    testId: "2",
    name: "app.js",
    languageId: "javascript",
    code: getLanguageDefinition("javascript").starterCode,
  },
  {
    sourceId: "3",
    testId: "4",
    name: "styles.css",
    languageId: "css",
    code: getLanguageDefinition("css").starterCode,
  },
  {
    sourceId: "5",
    testId: "6",
    name: "app.py",
    languageId: "python",
    code: getLanguageDefinition("python").starterCode,
  },
  {
    sourceId: "7",
    testId: "8",
    name: "app.ts",
    languageId: "typescript",
    code: getLanguageDefinition("typescript").starterCode,
  },
  {
    sourceId: "9",
    testId: "10",
    name: "app.html",
    languageId: "html",
    code: getLanguageDefinition("html").starterCode,
  },
  {
    sourceId: "11",
    testId: "12",
    name: "app.go",
    languageId: "go",
    code: getLanguageDefinition("go").starterCode,
  },
];

const initialWorkspace = createInitialWorkspace(defaultWorkspaceSeeds);

function buildPromptMetadata(
  file: WorkspaceFile,
  files: WorkspaceFile[],
  userContext: string,
): FilePromptMetadata {
  const companion = file.pairedFileId
    ? files.find((candidate) => candidate.id === file.pairedFileId)
    : undefined;

  const trimmedUserContext = userContext.trim();
  const contextLines = [
    `Current file kind: ${file.kind}`,
    `Current file path: ${file.path}`,
    companion ? `Companion file: ${companion.name}` : null,
    trimmedUserContext ? `User context: ${trimmedUserContext}` : null,
  ].filter(Boolean);

  return {
    languageId: file.languageId,
    languageLabel: file.languageLabel,
    fileName: file.name,
    testFileName: companion?.name,
    context: contextLines.join("\n"),
  };
}

export function useWorkspaceState() {
  const [files, setFiles] = useState<WorkspaceFile[]>(
    () => initialWorkspace.files,
  );
  const [openTabIds, setOpenTabIds] = useState<string[]>(
    () => initialWorkspace.openTabIds,
  );
  const [activeTabId, setActiveTabId] = useState<string>(
    () => initialWorkspace.activeTabId,
  );
  const [activeSidebarView, setActiveSidebarView] =
    useState<SidebarView>("explorer");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFileLanguageId, setNewFileLanguageId] =
    useState<LanguageId>("javascript");
  const [userContext, setUserContext] = useState("");
  const sidebarPanelRef = useRef<PanelImperativeHandle | null>(null);
  const nextFileId = useRef(initialWorkspace.files.length + 1);

  const openTabs = useMemo(
    () =>
      openTabIds
        .map((tabId) => files.find((file) => file.id === tabId))
        .filter(Boolean) as WorkspaceFile[],
    [files, openTabIds],
  );

  const activeTab =
    files.find((file) => file.id === activeTabId) ?? openTabs[0] ?? files[0];

  const sourceFiles = useMemo(
    () => files.filter((file) => file.kind === "source"),
    [files],
  );
  const testFiles = useMemo(
    () => files.filter((file) => file.kind === "test"),
    [files],
  );

  const filePromptMetadata = activeTab
    ? buildPromptMetadata(activeTab, files, userContext)
    : null;

  const expandSidebar = () => {
    sidebarPanelRef.current?.expand();
    setIsSidebarCollapsed(false);
  };

  const handleSidebarViewChange = (view: SidebarView) => {
    setActiveSidebarView(view);
    expandSidebar();
  };

  const handleSidebarToggle = () => {
    const sidebarPanel = sidebarPanelRef.current;

    if (!sidebarPanel) {
      return;
    }

    if (sidebarPanel.isCollapsed()) {
      sidebarPanel.expand();
      setIsSidebarCollapsed(false);
      return;
    }

    sidebarPanel.collapse();
    setIsSidebarCollapsed(true);
  };

  const updateFile = (
    fileId: string,
    updater: (file: WorkspaceFile) => WorkspaceFile,
  ) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) => (file.id === fileId ? updater(file) : file)),
    );
  };

  const openFile = (fileId: string) => {
    setOpenTabIds((currentTabs) =>
      currentTabs.includes(fileId) ? currentTabs : [...currentTabs, fileId],
    );
    setActiveTabId(fileId);
  };

  const closeTab = (fileId: string) => {
    const nextTabs = openTabIds.filter((tabId) => tabId !== fileId);

    if (nextTabs.length === 0) {
      const fallback = sourceFiles[0] ?? files[0];
      setOpenTabIds(fallback ? [fallback.id] : []);
      setActiveTabId(fallback?.id ?? "");
      return;
    }

    setOpenTabIds(nextTabs);

    if (activeTabId === fileId) {
      const fallbackIndex = Math.max(0, openTabIds.indexOf(fileId) - 1);
      setActiveTabId(nextTabs[fallbackIndex] ?? nextTabs[0]);
      return;
    }

    if (!nextTabs.includes(activeTabId)) {
      setActiveTabId(nextTabs[0]);
    }
  };

  const setActiveFileCode = (nextCode: string) => {
    if (!activeTab) return;

    updateFile(activeTab.id, (file) => ({
      ...file,
      code: nextCode,
      analysis: null,
      isAnalyzing: false,
      isSolutionUnlocked: false,
      isSolutionLoading: false,
      hasTriedSolution: false,
      solutionText: null,
      error: null,
    }));
  };

  const clearActiveTabState = () => {
    if (!activeTab) return;

    updateFile(activeTab.id, (file) => ({
      ...file,
      analysis: null,
      isAnalyzing: false,
      isSolutionUnlocked: false,
      isSolutionLoading: false,
      hasTriedSolution: false,
      solutionText: null,
      error: null,
    }));
  };

  const markSolutionAttempted = () => {
    if (!activeTab) return;

    updateFile(activeTab.id, (file) => ({
      ...file,
      hasTriedSolution: true,
    }));
  };

  const handleAnalyze = async () => {
    if (!activeTab || !filePromptMetadata) return;

    handleSidebarViewChange("analysis");

    const tabId = activeTab.id;
    updateFile(tabId, (file) => ({
      ...file,
      isAnalyzing: true,
      error: null,
      analysis: null,
      isSolutionUnlocked: false,
      hasTriedSolution: false,
      solutionText: null,
    }));

    try {
      const analysis = await analyzeCode(activeTab.code, {
        languageId: filePromptMetadata.languageId,
        languageLabel: filePromptMetadata.languageLabel,
        fileName: filePromptMetadata.fileName,
        testFileName: filePromptMetadata.testFileName,
        context: filePromptMetadata.context,
      });

      updateFile(tabId, (file) => ({
        ...file,
        analysis,
        isAnalyzing: false,
        error: null,
      }));
    } catch (error) {
      updateFile(tabId, (file) => ({
        ...file,
        isAnalyzing: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze code. Please check your connection and configuration.",
      }));
    }
  };

  const handleUnlockSolution = async () => {
    if (
      !activeTab ||
      !activeTab.analysis ||
      !filePromptMetadata ||
      !activeTab.hasTriedSolution
    )
      return;

    const tabId = activeTab.id;
    updateFile(tabId, (file) => ({
      ...file,
      isSolutionLoading: true,
      error: null,
    }));

    try {
      const solution = await getSolution(activeTab.code, activeTab.analysis, {
        languageId: filePromptMetadata.languageId,
        languageLabel: filePromptMetadata.languageLabel,
        fileName: filePromptMetadata.fileName,
        testFileName: filePromptMetadata.testFileName,
        context: filePromptMetadata.context,
      });

      updateFile(tabId, (file) => ({
        ...file,
        solutionText: solution,
        isSolutionUnlocked: true,
        isSolutionLoading: false,
      }));
    } catch (error) {
      updateFile(tabId, (file) => ({
        ...file,
        isSolutionLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to unlock solution.",
      }));
    }
  };

  const createNewFile = () => {
    const sourceId = String(nextFileId.current);
    const testId = String(nextFileId.current + 1);
    nextFileId.current += 2;

    setFiles((currentFiles) => {
      const { source, test } = createWorkspaceFilePair({
        sourceId,
        testId,
        languageId: newFileLanguageId,
        existingNames: currentFiles.map((file) => file.name),
      });

      return [...currentFiles, source, test];
    });

    setOpenTabIds((currentTabs) =>
      currentTabs.includes(sourceId) ? currentTabs : [...currentTabs, sourceId],
    );
    setActiveTabId(sourceId);
    handleSidebarViewChange("explorer");
  };

  return {
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

    // Actions
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
  };
}
