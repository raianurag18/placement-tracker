import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            ref={ref}
            onClick={() => onCheckedChange?.(!checked)}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-800 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900 flex items-center justify-center",
                checked ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" : "bg-transparent",
                className
            )}
            {...props}
            data-state={checked ? "checked" : "unchecked"}
        >
            {checked && <Check className="h-4 w-4" />}
        </button>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
