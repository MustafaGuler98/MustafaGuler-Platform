interface TechItem {
    name: string;
    iconUrl: string;
}

interface ContactItem {
    name: string;
    iconUrl: string;
    href: string;
}

export function TechStack() {
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

    const contacts: ContactItem[] = [
        { name: "GitHub", iconUrl: "https://skillicons.dev/icons?i=github", href: "https://github.com/mustafaguler98" },
        { name: "LinkedIn", iconUrl: "https://skillicons.dev/icons?i=linkedin", href: "https://www.linkedin.com/in/mustafaguler98/" },
        { name: "Email", iconUrl: "https://skillicons.dev/icons?i=gmail", href: "mailto:contact.mustafaguler@gmail.com" },
    ];

    return (
        <div className="w-full space-y-10">

            {/* TECH STACK SECTION */}
            <div>
                {/* Header: Neon Glitch with Moving Blue Scanline */}
                <div className="relative inline-block pb-1 mb-6">
                    <h3 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        TECH STACK
                    </h3>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                </div>

                {/* Tech Grid */}
                <div className="grid grid-cols-4 gap-2">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="group relative flex flex-col items-center justify-center gap-1.5 p-1.5 bg-black/40 border border-white/5 hover:border-cyan-500/50 rounded-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-default overflow-hidden aspect-square"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                            <div className="relative z-10 p-1 rounded-full bg-white/5 group-hover:bg-cyan-950/50 transition-colors">
                                <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <span className="relative z-10 text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white tracking-wider font-rajdhani uppercase transition-colors text-center w-full truncate">
                                {tech.name}
                            </span>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTACT SECTION */}
            <div>
                {/* Header: Neon Glitch */}
                <div className="relative inline-block pb-1 mb-6">
                    <h3 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        CONTACT
                    </h3>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                </div>

                {/* Contact Grid - 3 columns */}
                <div className="grid grid-cols-3 gap-2">
                    {contacts.map((contact) => (
                        <a
                            key={contact.name}
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col items-center justify-center gap-1.5 p-3 bg-black/40 border border-white/5 hover:border-cyan-500/50 rounded-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer overflow-hidden aspect-square"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                            <div className="relative z-10 p-1 rounded-full bg-white/5 group-hover:bg-cyan-950/50 transition-colors">
                                <img src={contact.iconUrl} alt={contact.name} className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <span className="relative z-10 text-[9px] font-bold text-gray-500 group-hover:text-white tracking-wider font-rajdhani uppercase transition-colors">
                                {contact.name}
                            </span>
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
