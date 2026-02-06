import { PublicActivities } from "@/types/archives";
import { ActivitySection } from "@/components/shared/ActivitySection";

interface ActivitySectionServerProps {
    activities: PublicActivities | null;
}

export function ActivitySectionServer({ activities }: ActivitySectionServerProps) {
    return (
        <section className="pb-24 px-4">
            <div className="container max-w-5xl mx-auto">
                {/* DIVIDER */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

                <ActivitySection activities={activities} />
            </div>
        </section>
    );
}
