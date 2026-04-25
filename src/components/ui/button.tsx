import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_12px_30px_rgba(34,211,238,0.22)]",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
      ghost:
        "bg-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-100",
      outline:
        "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800/80",
      danger: "bg-rose-500 text-white hover:bg-rose-400",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
