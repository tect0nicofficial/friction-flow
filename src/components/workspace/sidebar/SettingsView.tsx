import { supportedLanguages } from "../../../lib/workspace";

export function SettingsView() {
  return (
    <div className="space-y-3 px-3 py-2.5 text-[13px] leading-relaxed text-[#cccccc]">
      <div className="rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
          Language support
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {supportedLanguages.map((language) => (
            <span
              key={language.id}
              className="rounded-full border border-[#3c3c3c] px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-[#9cdcfe]"
            >
              {language.badge}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-3 text-[#858585]">
        Companion test stubs are generated automatically from the active file's
        language definition.
      </div>

      <div className="rounded-xs border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-3 text-[#858585]">
        The editor sends the active file name, language, and companion test name
        to the backend analysis prompt.
      </div>
    </div>
  );
}
