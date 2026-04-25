import { useEffect, useState } from "react";
import { Monitor, X } from "lucide-react";

export function MobileDeviceBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="flex items-center gap-3 bg-linear-to-r from-[#0e639c] to-[#1177bb] px-4 py-2.5 text-[12px] text-white shadow-lg">
      <Monitor size={16} className="shrink-0 opacity-90" />
      <span className="flex-1 font-medium">
        Use a desktop device for the best editing experience
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded p-1 transition-colors hover:bg-white/20"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
