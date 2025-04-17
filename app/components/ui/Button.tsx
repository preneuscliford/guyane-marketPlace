import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500":
              variant === "default",
            "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400":
              variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400":
              variant === "ghost",
          },
          "h-10 px-4 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
