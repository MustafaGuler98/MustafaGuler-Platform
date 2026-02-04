import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";

interface ContactItem {
    name: string;
    iconUrl: string;
    href: string;
}

export function ContactWidget() {
    const contacts: ContactItem[] = [
        { name: "GitHub", iconUrl: "/icons/github.svg", href: "https://github.com/mustafaguler98" },
        { name: "LinkedIn", iconUrl: "/icons/linkedin.svg", href: "https://www.linkedin.com/in/mustafaguler98/" },
        { name: "Email", iconUrl: "/icons/email.svg", href: "mailto:contact.mustafaguler@gmail.com" },
    ];

    return (
        <SidebarSection title="CONTACT">
            <div className="grid grid-cols-3 gap-2">
                {contacts.map((contact) => (
                    <SidebarItem
                        key={contact.name}
                        label={contact.name}
                        imageUrl={contact.iconUrl}
                        href={contact.href}
                        truncateLabel={false}
                    />
                ))}
            </div>
        </SidebarSection>
    );
}
