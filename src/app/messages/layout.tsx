import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mensajes | TextiSur",
    description: "Tus conversaciones en TextiSur",
};

export default function MessagesLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container mx-auto py-6 h-[calc(100vh-80px)]">
            {children}
        </div>
    );
}
