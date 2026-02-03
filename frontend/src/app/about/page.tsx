import AboutClient from "./about-client";
import { archivesService } from "@/services/archivesService";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const stats = await archivesService.getStats();

    return (
        <AboutClient stats={stats} />
    );
}
