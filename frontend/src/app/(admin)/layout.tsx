import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "System Access - Admin Panel for MustafaGuler.com",
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
