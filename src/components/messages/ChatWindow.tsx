"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, MoreVertical, Ban, Check, CheckCheck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
    isRead: boolean;
    sender?: {
        name: string;
    }
}

interface ConversationDetail {
    id: number;
    buyerId: number;
    storeId: number;
    productId?: number;
    isBlocked: boolean;
    blockedBy?: number;
    store?: {
        id: number;
        name: string;
        logo?: string;
        userId: number; // Owner ID
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
        price: number;
    };
    messages: Message[];
}

interface ChatWindowProps {
    conversationId: number;
    onBack?: () => void;
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
    const { user } = useAuth();
    const [conversation, setConversation] = useState<ConversationDetail | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchConversation = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(`/api/conversations/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConversation(res.data);
        } catch (error) {
            console.error("Error fetching conversation:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async () => {
        if (!conversation) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/api/conversations/${conversation.id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchConversation();
        } catch (error) {
            console.error("Error toggling block:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchConversation();
        const interval = setInterval(fetchConversation, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        if (scrollRef.current) {
            // Only auto-scroll if close to bottom or initial load
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Simple heuristic: if difference is small, scroll. Or just always scroll on new messages like requested.
            // "scroll automático al último mensaje"
            // Typically we should check if user scrolled up. For now, force scroll.
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation?.messages.length]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/messages",
                { conversationId, content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage("");
            fetchConversation();
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    // Mark as read
    useEffect(() => {
        if (!conversation || !user) return;
        const unreadMessages = conversation.messages.filter(m => !m.isRead && m.senderId !== Number(user.id));
        if (unreadMessages.length === 0) return;

        const markRead = async () => {
            const token = localStorage.getItem("token");
            try {
                // Optimization: endpoint could accept array, but existing is single. 
                // Let's loop but carefully. Actually the browser limits concurrent connections.
                // Better to update API to mark all as read for conversation.
                // Staying with loop for now as per previous implementation but limiting concurrency or just "fire and forget".
                await Promise.all(unreadMessages.map(msg =>
                    axios.patch(`/api/messages/${msg.id}/read`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ));
            } catch (e) { }
        };
        markRead();
    }, [conversation?.messages, user]);


    if (loading) return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando...</div>;
    if (!conversation) return <div className="flex items-center justify-center h-full text-muted-foreground">Conversación no encontrada.</div>;

    const otherParty = user?.role === "comprador"
        ? {
            name: conversation.store?.name || "Tienda",
            image: conversation.store?.logo,
        }
        : {
            name: conversation.buyer?.name || "Comprador",
            image: conversation.buyer?.avatarUrl,
        };

    const isBlockedByMe = conversation.isBlocked && conversation.blockedBy === Number(user?.id);
    const isBlockedByOther = conversation.isBlocked && conversation.blockedBy !== Number(user?.id);

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    conversation.messages.forEach((msg) => {
        const dateKey = format(new Date(msg.createdAt), "yyyy-MM-dd");
        let group = groupedMessages.find(g => g.date === dateKey);
        if (!group) {
            group = { date: dateKey, messages: [] };
            groupedMessages.push(group);
        }
        group.messages.push(msg);
    });

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden border">
            {/* Header */}
            <div className="p-3 border-b bg-card flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Avatar className="h-10 w-10 border ring-2 ring-background">
                        <AvatarImage src={otherParty.image} className="object-cover" />
                        <AvatarFallback>{otherParty.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-sm leading-tight flex items-center gap-2">
                            {otherParty.name}
                            {isBlockedByOther && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Bloqueado</span>}
                        </h3>
                        {conversation.product && (
                            <Link href={`/products/${conversation.product.id}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                                <ShoppingBag className="h-3 w-3" />
                                {conversation.product.name} • ${conversation.product.price}
                            </Link>
                        )}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleBlockToggle} className={isBlockedByMe ? "text-primary" : "text-destructive"}>
                            <Ban className="mr-2 h-4 w-4" />
                            {isBlockedByMe ? "Desbloquear" : "Bloquear usuario"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                {conversation.product && (
                    <div className="bg-secondary/20 p-4 rounded-xl flex gap-4 items-center border border-border/50 max-w-sm mx-auto mb-6">
                        {conversation.product.imageUrl && (
                            <div className="h-16 w-16 bg-white rounded-md overflow-hidden relative border shrink-0">
                                <img src={conversation.product.imageUrl} alt={conversation.product.name} className="object-cover w-full h-full" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{conversation.product.name}</h4>
                            <p className="text-sm font-bold text-primary">${conversation.product.price} MXN</p>
                            <Link href={`/products/${conversation.product.id}`}>
                                <Button size="sm" variant="outline" className="h-7 text-xs mt-2 w-full">Ver Producto</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {groupedMessages.map((group) => (
                    <div key={group.date}>
                        <div className="flex justify-center mb-4">
                            <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
                                {format(new Date(group.date), "d 'de' MMMM", { locale: es })}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {group.messages.map((msg) => {
                                const isMe = msg.senderId === Number(user?.id);
                                return (
                                    <div
                                        key={msg.id}
                                        className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[80%] md:max-w-[65%] px-4 py-2 rounded-2xl text-sm shadow-sm relative group transition-all",
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-card border text-foreground rounded-tl-none"
                                            )}
                                        >
                                            <p className="leading-relaxed">{msg.content}</p>
                                            <div
                                                className={cn(
                                                    "text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70",
                                                    isMe ? "text-primary-foreground/80" : "text-muted-foreground"
                                                )}
                                            >
                                                {format(new Date(msg.createdAt), "HH:mm")}
                                                {isMe && (
                                                    msg.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-background/80 backdrop-blur pb-safe">
                {conversation.isBlocked ? (
                    <div className="flex items-center justify-center p-3 text-sm text-muted-foreground bg-muted/30 rounded-md">
                        <Ban className="h-4 w-4 mr-2" />
                        {isBlockedByMe ? "Has bloqueado a este usuario." : "No puedes responder a esta conversación."}
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full px-4"
                            autoComplete="off"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!newMessage.trim() || sending}
                            className="rounded-full w-10 h-10 shrink-0"
                        >
                            <Send className="h-4 w-4 -ml-0.5" />
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
