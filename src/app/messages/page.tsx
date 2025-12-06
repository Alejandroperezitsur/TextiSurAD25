"use client";

import { useState } from "react";
import { ConversationList } from "@/components/messages/ConversationList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

    return (
        <div className="flex h-full border rounded-lg overflow-hidden bg-background shadow-sm">
            {/* Sidebar List */}
            <div
                className={cn(
                    "w-full md:w-1/3 border-r bg-muted/10 h-full",
                    selectedConversationId ? "hidden md:block" : "block"
                )}
            >
                <div className="p-4 border-b font-bold bg-muted/20">Mensajes</div>
                <ConversationList
                    onSelect={(id) => setSelectedConversationId(id)}
                    selectedId={selectedConversationId}
                />
            </div>

            {/* Chat Window */}
            <div
                className={cn(
                    "w-full md:w-2/3 h-full bg-background",
                    !selectedConversationId ? "hidden md:flex items-center justify-center p-6 text-center text-muted-foreground" : "flex flex-col"
                )}
            >
                {selectedConversationId ? (
                    <ChatWindow
                        conversationId={selectedConversationId}
                        onBack={() => setSelectedConversationId(null)}
                    />
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Tus Conversaciones</h3>
                        <p>Selecciona una conversación para leer sus mensajes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
