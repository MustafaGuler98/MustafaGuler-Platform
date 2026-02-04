import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";

interface TechItem {
    name: string;
    iconUrl: string;
}

export function TechStackWidget() {
    const technologies: TechItem[] = [
        { name: "C#", iconUrl: "/icons/csharp.svg" },
        { name: ".NET", iconUrl: "/icons/dotnet.svg" },
        { name: "Python", iconUrl: "/icons/python.svg" },
        { name: "JS", iconUrl: "/icons/js.svg" },
        { name: "TS", iconUrl: "/icons/ts.svg" },
        { name: "Next.js", iconUrl: "/icons/nextjs.svg" },
        { name: "React", iconUrl: "/icons/react.svg" },
        { name: "Docker", iconUrl: "/icons/docker.svg" },
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
