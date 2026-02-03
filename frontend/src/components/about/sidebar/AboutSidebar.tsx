import { TechStackWidget } from "./TechStackWidget";
import { ContactWidget } from "./ContactWidget";
import { ArchivesWidget } from "./ArchivesWidget";
import type { ArchivesStats } from "@/types/archives";

interface AboutSidebarProps {
    stats: ArchivesStats | null;
}

export function AboutSidebar({ stats }: AboutSidebarProps) {
    return (
        <div className="w-full space-y-10">
            <TechStackWidget />
            <ContactWidget />
            <ArchivesWidget stats={stats} />
        </div>
    );
}
