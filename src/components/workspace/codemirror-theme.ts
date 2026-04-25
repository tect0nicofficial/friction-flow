import { EditorView } from "@codemirror/view";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  LanguageSupport,
} from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import { LanguageId } from "../../types";

/** VS Code dark theme overrides for CodeMirror */
export const vscodeDarkTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      fontSize: "14px",
      backgroundColor: "#1e1e1e",
    },
    ".cm-content": {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      padding: "8px 0",
      caretColor: "#d4d4d4",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#d4d4d4",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      color: "#c6c6c6",
    },
    ".cm-gutters": {
      backgroundColor: "#1e1e1e",
      color: "#858585",
      border: "none",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: "14px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 12px 0 8px",
      minWidth: "3em",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineHeight: "1.6",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(0, 122, 204, 0.3)",
      outline: "1px solid rgba(0, 122, 204, 0.6)",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#3c3c3c",
      border: "none",
      color: "#858585",
    },
  },
  { dark: true },
);

/** Shared syntax highlighting fallback */
export const fallbackHighlighting = syntaxHighlighting(defaultHighlightStyle, {
  fallback: true,
});

export function getLanguageExtension(
  languageId: LanguageId,
): LanguageSupport | null {
  switch (languageId) {
    case "javascript":
      return javascript();
    case "javascriptreact":
      return javascript({ jsx: true });
    case "typescript":
      return javascript({ typescript: true });
    case "typescriptreact":
      return javascript({ jsx: true, typescript: true });
    case "python":
      return python();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "markdown":
      return markdown();
    case "java":
      return java();
    case "go":
      return go();
    case "ruby":
      return javascript();
    default:
      return javascript();
  }
}
