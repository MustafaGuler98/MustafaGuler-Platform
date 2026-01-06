import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "About Mustafa Guler - Software Developer, .NET Specialist, and Digital Mind Architect.",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
