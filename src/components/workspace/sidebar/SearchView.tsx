import { Search } from "lucide-react";
import { WorkspaceFile } from "../../../types";

export function SearchView({
  files,
  searchQuery,
  onSearchQueryChange,
  onOpenFile,
}: {
  files: WorkspaceFile[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenFile: (fileId: string) => void;
}) {
  const query = searchQuery.trim().toLowerCase();
  const results = query
    ? files.filter((file) => {
        const haystack = [file.name, file.path, file.languageLabel, file.code]
          .join("\n")
          .toLowerCase();

        return haystack.includes(query);
      })
    : files;

  return (
    <div className="space-y-3 px-3 py-2.5">
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
          Search workspace
        </div>
        <div className="flex items-center gap-2 rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2">
          <Search size={14} className="text-[#858585]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search files, languages, or code"
            className="w-full bg-transparent text-[13px] text-[#d4d4d4] outline-none placeholder:text-[#858585]"
          />
        </div>
      </div>

      <div className="text-[12px] text-[#858585]">
        {query
          ? `${results.length} match${results.length === 1 ? "" : "es"}`
          : "Showing all workspace files"}
      </div>

      <div className="space-y-1">
        {results.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => onOpenFile(file.id)}
            className="w-full rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-left transition-colors hover:border-[#007acc] hover:bg-[#242424]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-[13px] text-[#cccccc]">
                {file.name}
              </span>
              <span className="shrink-0 rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#9cdcfe]">
                {file.languageLabel}
              </span>
            </div>
            <div className="mt-1 truncate text-[12px] text-[#858585]">
              {file.path}
            </div>
            <div className="mt-1 truncate text-[12px] text-[#858585]">
              {buildPreview(file)}
            </div>
          </button>
        ))}

        {!results.length ? (
          <div className="rounded-xs border border-dashed border-[#3c3c3c] px-3 py-4 text-center text-[#858585]">
            No files match this search.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function buildPreview(file: WorkspaceFile) {
  const firstLine = file.code
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return (
    firstLine ??
    `${file.kind === "test" ? "Generated test" : "Source file"} for ${file.languageLabel}`
  );
}
