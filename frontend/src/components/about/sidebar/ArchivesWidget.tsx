import { SidebarSection } from "./SidebarSection";
import { BookOpen, Film, Gamepad2, Headphones, Dices, Quote, Tv, Eye } from "lucide-react";
import type { ArchivesStats } from "@/types/archives";

interface Props {
    stats: ArchivesStats | null;
}

export function ArchivesWidget({ stats }: Props) {
    const items = [
        { label: "BOOKS", count: stats?.bookCount, icon: <BookOpen className="w-3 h-3" />, color: "text-amber-400" },
        { label: "MOVIES", count: stats?.movieCount, icon: <Film className="w-3 h-3" />, color: "text-purple-400" },
        { label: "MUSIC", count: stats?.musicCount, icon: <Headphones className="w-3 h-3" />, color: "text-pink-400" },
        { label: "TV", count: stats?.tvSeriesCount, icon: <Tv className="w-3 h-3" />, color: "text-blue-500" },
        { label: "ANIME", count: stats?.animeCount, icon: <Eye className="w-3 h-3" />, color: "text-rose-500" },
        { label: "GAMES", count: stats?.gameCount, icon: <Gamepad2 className="w-3 h-3" />, color: "text-cyan-400" },
        { label: "TTRPG", count: stats?.ttrpgCount, icon: <Dices className="w-3 h-3" />, color: "text-emerald-400" },
        { label: "QUOTES", count: stats?.quoteCount, icon: <Quote className="w-3 h-3" />, color: "text-gray-400" }, 
    ];

    return (
        <SidebarSection title="ARCHIVES">
            <div className="grid grid-cols-2 gap-2">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2 bg-black/40 border border-white/5 rounded-sm hover:border-cyan-500/50 transition-all cursor-default group hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden">
                        {/* TechStack style background/hover effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>

                        <div className="flex items-center gap-2 overflow-hidden relative z-10">
                            <div className="p-1 rounded-full bg-white/5 group-hover:bg-cyan-950/50 transition-colors duration-300 transform group-hover:scale-110">
                                <span className={`${item.color} font-bold transition-colors`}>{item.icon}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 truncate font-rajdhani group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-500 font-mono group-hover:text-cyan-300 relative z-10 transition-colors">
                            {item.count ?? 0}
                        </span>

                        {/* Corner Accents from SidebarItem */}
                        <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                    </div>
                ))}
            </div>
        </SidebarSection>
    );
}
