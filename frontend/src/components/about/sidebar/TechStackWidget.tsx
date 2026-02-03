import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";

interface TechItem {
    name: string;
    iconUrl: string;
}

export function TechStackWidget() {
    const technologies: TechItem[] = [
        { name: "C#", iconUrl: "https://skillicons.dev/icons?i=cs" },
        { name: ".NET", iconUrl: "https://skillicons.dev/icons?i=dotnet" },
        { name: "Python", iconUrl: "https://skillicons.dev/icons?i=python" },
        { name: "JS", iconUrl: "https://skillicons.dev/icons?i=js" },
        { name: "TS", iconUrl: "https://skillicons.dev/icons?i=ts" },
        { name: "Next.js", iconUrl: "https://skillicons.dev/icons?i=nextjs" },
        { name: "React", iconUrl: "https://skillicons.dev/icons?i=react" },
        { name: "Docker", iconUrl: "https://skillicons.dev/icons?i=docker" },
    ];

    return (
        <SidebarSection title="TECH STACK">
            <div className="grid grid-cols-4 gap-2">
                {technologies.map((tech) => (
                    <SidebarItem
                        key={tech.name}
                        label={tech.name}
                        imageUrl={tech.iconUrl}
                    />
                ))}
            </div>
        </SidebarSection>
    );
}
