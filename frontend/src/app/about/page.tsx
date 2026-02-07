import AboutClient from "./about-client";
import { archivesService } from "@/services/archivesService";

export const revalidate = 86400;

export default async function AboutPage() {
    const [stats, activities] = await Promise.all([
        archivesService.getStats(),
        archivesService.getActivity(),
    ]);

    return (
        <AboutClient stats={stats} activities={activities} />
    );
}
