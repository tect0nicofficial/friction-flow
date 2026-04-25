import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

type ResizablePanelGroupProps = React.ComponentPropsWithoutRef<typeof Group> & {
  className?: string;
};

type ResizablePanelProps = React.ComponentPropsWithoutRef<typeof Panel> & {
  className?: string;
  defaultSize?: number | string;
};

type ResizableHandleProps = React.ComponentPropsWithoutRef<typeof Separator> & {
  className?: string;
  withHandle?: boolean;
};

const ResizablePanelGroup = ({
  className,
  orientation = "horizontal",
  ...props
}: ResizablePanelGroupProps) => (
  <Group
    className={cn(
      "flex h-full w-full",
      orientation === "horizontal" ? "flex-row" : "flex-col",
      className,
    )}
    orientation={orientation}
    {...props}
  />
);

const ResizablePanel = ({
  className,
  defaultSize,
  ...props
}: ResizablePanelProps) => (
  <Panel
    className={cn("min-w-0", className)}
    defaultSize={
      typeof defaultSize === "number" ? `${defaultSize}%` : defaultSize
    }
    {...props}
  />
);

const ResizableHandle = ({
  className,
  withHandle = true,
  ...props
}: ResizableHandleProps) => (
  <Separator
    className={cn(
      "group relative mx-2 flex w-px shrink-0 cursor-col-resize items-center justify-center bg-transparent transition-colors after:absolute after:inset-y-0 after:w-px after:bg-slate-800 hover:after:bg-cyan-400",
      className,
    )}
    {...props}
  >
    {withHandle ? (
      <div className="pointer-events-none absolute inset-y-0 flex w-4 items-center justify-center">
        <div className="h-10 w-0.75 rounded-full bg-slate-700 transition-colors group-hover:bg-cyan-400" />
      </div>
    ) : null}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
