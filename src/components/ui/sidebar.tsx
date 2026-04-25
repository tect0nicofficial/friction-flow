import * as React from "react";
import { ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

type SidebarProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function SidebarProvider({
  children,
  className,
  style,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  ...props
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(nextOpen);
        return;
      }

      setUncontrolledOpen(nextOpen);
    },
    [onOpenChange],
  );

  const toggleSidebar = React.useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar,
      state: open ? ("expanded" as const) : ("collapsed" as const),
    }),
    [open, setOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn("min-h-screen w-full", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

function Sidebar({
  children,
  className,
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  ...props
}: SidebarProps) {
  const { open } = useSidebar();
  const collapsed = collapsible !== "none" && !open;

  return (
    <aside
      data-slot="sidebar"
      data-state={collapsed ? "collapsed" : "expanded"}
      data-side={side}
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden border-slate-800/80 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-[width,transform] duration-200 ease-out",
        side === "left" ? "border-r" : "border-l",
        variant === "floating" &&
          "m-3 rounded-3xl border shadow-2xl shadow-slate-950/40",
        variant === "inset" &&
          "m-3 rounded-3xl border shadow-2xl shadow-slate-950/40",
        className,
      )}
      style={{ width: collapsed ? "4.75rem" : "18rem" }}
      {...props}
    >
      {children}
      {collapsible !== "none" ? <SidebarRail side={side} /> : null}
    </aside>
  );
}

function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("border-b border-slate-800/80 px-4 py-4", className)}
      {...props}
    />
  );
}

function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-auto px-4 py-4", className)}
      {...props}
    />
  );
}

function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t border-slate-800/80 px-4 py-4", className)}
      {...props}
    />
  );
}

function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn(
        "space-y-3 rounded-3xl border border-slate-800/70 bg-slate-950/40 p-3",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("space-y-3", className)}
      {...props}
    />
  );
}

function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("space-y-2", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({
  className,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("list-none", className)}
      {...props}
    />
  );
}

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

function SidebarMenuButton({
  className,
  isActive,
  type = "button",
  ...props
}: SidebarMenuButtonProps) {
  const { state } = useSidebar();

  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive ? "true" : "false"}
      type={type}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium transition-colors",
        isActive
          ? "bg-cyan-500/10 text-cyan-100 ring-1 ring-cyan-400/20"
          : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50",
        state === "collapsed" && "justify-center px-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={toggleSidebar}
      className={cn("h-10 w-10 rounded-2xl p-0 text-slate-200", className)}
      aria-label="Toggle sidebar"
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
}

function SidebarRail({
  className,
  side = "left",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  side?: "left" | "right";
}) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={toggleSidebar}
      className={cn(
        "absolute top-0 z-20 hidden h-full w-4 items-center justify-center border-slate-800/80 bg-transparent text-slate-500 transition-colors hover:bg-slate-800/50 hover:text-slate-100 lg:flex",
        side === "left" ? "-right-2 border-r" : "-left-2 border-l",
        className,
      )}
      {...props}
    >
      {side === "left" ? (
        <ChevronLeft className="h-3.5 w-3.5" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
};
