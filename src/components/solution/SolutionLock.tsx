import { AlertCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export function SolutionLock({
  canUnlock,
  hasTriedSolution,
  isLoading,
  onMarkSolutionAttempted,
  onUnlock,
}: {
  canUnlock: boolean;
  hasTriedSolution: boolean;
  isLoading: boolean;
  onMarkSolutionAttempted: () => void;
  onUnlock: () => void;
}) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="h-8 w-8 animate-spin text-[#007acc]" />
        <div className="mt-4 text-[13px] font-medium text-[#cccccc]">
          Generating solution...
        </div>
      </>
    );
  }

  if (canUnlock) {
    return (
      <>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#252526] text-[#007acc] border border-[#3c3c3c]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h4 className="mt-4 text-[14px] font-semibold text-white">
          Fix locked
        </h4>
        <p className="mt-1 max-w-sm text-[13px] text-[#858585] text-center">
          Try the change yourself first. Mark that you have attempted a fix,
          then reveal the answer when you are ready.
        </p>
        {hasTriedSolution ? (
          <Button
            onClick={onUnlock}
            className="mt-4 gap-2 bg-[#0e639c] hover:bg-[#1177bb] text-white h-7 px-3 text-[12px] font-medium rounded-sm border hover:border-[#1177bb]"
          >
            Reveal fix
            <ChevronRight className="h-3 w-3" />
          </Button>
        ) : (
          <Button
            onClick={onMarkSolutionAttempted}
            variant="outline"
            className="mt-4 h-7 px-3 text-[12px] font-medium text-[#d4d4d4] hover:bg-[#2a2d2e] hover:text-white"
          >
            I tried it
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <AlertCircle className="h-8 w-8 text-[#858585]" strokeWidth={1} />
      <h4 className="mt-4 text-[14px] font-medium text-[#858585]">
        Solve the problem to see diff
      </h4>
    </>
  );
}
