"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ShoppingBag } from "lucide-react";

interface Conversation {
    id: number;
    buyerId: number;
    storeId: number;
    lastMessageAt: string;
    store?: {
        id: number;
        name: string;
        logo?: string;
    };
    buyer?: {
        id: number;
        name: string;
        avatarUrl?: string;
    };
    product?: {
        id: number;
        name: string;
        imageUrl?: string;
    };
    messages: {
        content: string;
        isRead: boolean;
        createdAt: string;
        senderId: number; // Ensure API returns this
    }[];
}

interface ConversationListProps {
    onSelect: (id: number) => void;
    selectedId?: number | null;
}

export function ConversationList({ onSelect, selectedId }: ConversationListProps) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await axios.get("/api/conversations", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConversations(res.data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Cargando conversaciones...</div>;
    }

    if (conversations.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                <ShoppingBag className="h-8 w-8 opacity-20" />
                <p className="text-sm">No tienes mensajes.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 overflow-y-auto h-full p-2">
            {conversations.map((conv) => {
                const otherParty = user?.role === "comprador"
                    ? {
                        name: conv.store?.name || "Tienda",
                        image: conv.store?.logo,
                    }
                    : {
                        name: conv.buyer?.name || "Comprador",
                        image: conv.buyer?.avatarUrl,
                    };

                const lastMessage = conv.messages[0];
                const hasUnread = lastMessage && !lastMessage.isRead && lastMessage.senderId !== Number(user?.id);

                return (
                    <Card
                        key={conv.id}
                        className={cn(
                            "p-3 cursor-pointer hover:bg-accent/50 transition-all border-transparent hover:border-border",
                            selectedId === conv.id ? "bg-accent border-primary shadow-sm" : "bg-card"
                        )}
                        onClick={() => onSelect(conv.id)}
                    >
                        <div className="flex gap-3">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={otherParty.image} />
                                    <AvatarFallback>{otherParty.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {conv.product && (
                                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border shadow-sm" title={conv.product.name}>
                                        <Avatar className="h-4 w-4">
                                            <AvatarImage src={conv.product.imageUrl} className="object-cover" />
                                            <AvatarFallback><ShoppingBag className="h-2 w-2" /></AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className={cn("text-sm truncate", hasUnread ? "font-bold" : "font-medium")}>
                                        {otherParty.name}
                                    </h4>
                                    {conv.lastMessageAt && (
                                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                                            {formatDistanceToNow(new Date(conv.lastMessageAt), {
                                                addSuffix: false,
                                                locale: es,
                                            })}
                                        </span>
                                    )}
                                </div>

                                {conv.product && (
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                                        <ShoppingBag className="h-3 w-3" />
                                        <span className="truncate max-w-[120px]">{conv.product.name}</span>
                                    </div>
                                )}

                                <p className={cn("text-xs truncate", hasUnread ? "font-semibold text-foreground" : "text-muted-foreground")}>
                                    {lastMessage?.senderId === Number(user?.id) && "Tú: "}
                                    {lastMessage?.content || "Nueva conversación"}
                                </p>
                            </div>

                            {hasUnread && (
                                <div className="self-center">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                </div>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
