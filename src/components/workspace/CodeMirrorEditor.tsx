import { type MutableRefObject, useEffect, useRef } from "react";
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
} from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import {
  defaultKeymap,
  indentWithTab,
  history,
  historyKeymap,
} from "@codemirror/commands";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { LanguageId } from "../../types";
import {
  vscodeDarkTheme,
  fallbackHighlighting,
  getLanguageExtension,
} from "./codemirror-theme";

export function CodeMirrorEditor({
  code,
  languageId,
  onChangeCode,
  editorViewRef,
}: {
  code: string;
  languageId: LanguageId;
  onChangeCode: (code: string) => void;
  editorViewRef: MutableRefObject<EditorView | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const languageCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChangeCode);
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChangeCode;
  }, [onChangeCode]);

  useEffect(() => {
    if (!containerRef.current) return;

    const langExt = getLanguageExtension(languageId);

    const startState = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        languageCompartment.current.of(langExt ? [langExt] : []),
        oneDark,
        vscodeDarkTheme,
        fallbackHighlighting,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isExternalUpdate.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorState.tabSize.of(2),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    editorViewRef.current = view;
    view.focus();

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== code) {
      isExternalUpdate.current = true;
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: code,
        },
      });
      isExternalUpdate.current = false;
    }
  }, [code, editorViewRef]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;

    const langExt = getLanguageExtension(languageId);
    view.dispatch({
      effects: languageCompartment.current.reconfigure(
        langExt ? [langExt] : [],
      ),
    });
  }, [languageId, editorViewRef]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden [&_.cm-editor]:h-full"
    />
  );
}
