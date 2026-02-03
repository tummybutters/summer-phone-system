import * as React from "react"
import { cn } from "@/lib/utils"

function GlassCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all hover:bg-white/10 hover:border-white/20 shadow-xl",
                className
            )}
            {...props}
        />
    )
}

export { GlassCard }
