import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-base shadow-xs transition-all outline-none",
        "focus:border-walnut focus:ring-0 focus-visible:border-walnut focus-visible:ring-0",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
