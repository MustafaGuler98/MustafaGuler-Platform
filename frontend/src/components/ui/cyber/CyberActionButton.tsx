"use client";

import React from "react";
import { Loader2, CheckCircle2, Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CyberActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    status?: "idle" | "submitting" | "success" | "error";
    defaultText?: string;
    submittingText?: string;
    successText?: string;
    errorText?: string;
}

export function CyberActionButton({
    className,
    status = "idle",
    defaultText = "SEND MESSAGE",
    submittingText = "TRANSMITTING...",
    successText = "SIGNAL SENT",
    errorText = "FAILED",
    type = "button",
    disabled,
    ...props
}: CyberActionButtonProps) {
    const isLoading = status === "submitting";
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={cn(
                "relative group overflow-hidden rounded-md px-6 py-3 transition-all duration-300 w-full tracking-wider font-medium font-sans",
                "backdrop-blur-md border",
                status === "idle" && "bg-violet-500/15 border-violet-500/20 text-foreground shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:bg-violet-500/25 hover:border-cyan-neon/30 hover:text-cyan-neon hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] cursor-pointer",
                // Success State
                isSuccess && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-none cursor-default",
                // Error State
                isError && "bg-red-500/10 border-red-500/30 text-red-400 shadow-none",
                // Disabled
                (disabled || isLoading) && "opacity-60 cursor-wait bg-muted/20 border-white/5",
                className
            )}
            {...props}
        >
            {/* Shine Effect */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/10 to-transparent translate-x-[-100%] transition-transform duration-700",
                status === "idle" && "group-hover:translate-x-[100%]"
            )} />

            {/* Loading Line */}
            <div className={cn(
                "absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 scale-x-0 transition-transform duration-300",
                isLoading && "scale-x-100 animate-pulse"
            )} />

            <span className="relative z-10 flex items-center justify-center gap-3 font-sans text-sm uppercase">
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        {submittingText}
                    </>
                ) : isSuccess ? (
                    <>
                        <CheckCircle2 className="w-4 h-4" />
                        {successText}
                    </>
                ) : isError ? (
                    <>
                        <AlertTriangle className="w-4 h-4" />
                        {errorText}
                    </>
                ) : (
                    <>
                        {defaultText}
                        {/* 
                          Cyan on hover
                        */}
                        <Send className="w-4 h-4 text-violet-400 group-hover:text-cyan-neon group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </>
                )}
            </span>
        </button>
    );
}
