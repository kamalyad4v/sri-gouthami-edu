"use client";

import React from "react";
import { cn } from "@/lib/utils";

import Link from "next/link";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items: BentoItem[];
}

function BentoGrid({ items }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <Link
                    href="/auth/sign-in"
                    key={index}
                    className={cn(
                        "group relative p-5 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer block",
                        "glass-panel border-zinc-900/40",
                        "hover:shadow-[0_8px_32px_rgba(16,185,129,0.1)] hover:border-emerald-500/30",
                        "hover:-translate-y-0.5 will-change-transform flex flex-col justify-between min-h-[180px]",
                        item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
                        {
                            "shadow-[0_8px_32px_rgba(16,185,129,0.1)] -translate-y-0.5 border-emerald-500/20":
                                item.hasPersistentHover,
                        }
                    )}
                >
                    <div
                        className={`absolute inset-0 ${
                            item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        } transition-opacity duration-300`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[length:6px_6px]" />
                    </div>

                    <div className="relative flex flex-col space-y-3 h-full justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center glass-inner-card group-hover:bg-emerald-500/10 transition-all duration-300">
                                    {item.icon}
                                </div>
                                <span
                                    className={cn(
                                        "text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm",
                                        "glass-inner-card text-emerald-400 border-emerald-500/10",
                                        "transition-colors duration-300 group-hover:bg-emerald-500/20"
                                    )}
                                >
                                    {item.status || "Active"}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="font-bold text-white tracking-tight text-sm flex items-baseline">
                                    {item.title}
                                    {item.meta && (
                                        <span className="ml-2 text-[10px] text-zinc-500 font-normal">
                                            {item.meta}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400">
                                {item.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-md glass-inner-card backdrop-blur-sm transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-400"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.cta || "Explore →"}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-emerald-500/10 to-transparent ${
                            item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        } transition-opacity duration-300`}
                    />
                </Link>
            ))}
        </div>
    );
}

export { BentoGrid };
