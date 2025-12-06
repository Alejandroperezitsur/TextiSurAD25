import { NextRequest, NextResponse } from "next/server";
import { Message, Conversation, User } from "@/models";
import jwt from "jsonwebtoken";

async function getUser(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro") as any;
    } catch (e) {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId, content } = body;

        if (!conversationId || !content) {
            return NextResponse.json({ error: "Missing conversationId or content" }, { status: 400 });
        }

        // Check if user is part of the conversation
        const conversation = await Conversation.findByPk(conversationId, {
            include: ["store", "buyer"] // Might need to be more specific or use standard include
        });

        // NOTE: In previous tool call I updated index.ts, so string aliases should work if defined correctly.
        // However, it's safer to not rely on string alias if not sure. 
        // But index.ts has `as: "store"` and `as: "buyer"`.

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isBuyer = conversation.buyerId === user.id;
        const storeOwnerId = (conversation as any).store?.userId;

        // If not buyer and not store owner
        if (!isBuyer && storeOwnerId !== user.id) {
            // Wait, we need to load the store to check owner if we don't trust the client or if we didn't include it. 
            // In `findByPk` above I included "store".
            if ((conversation as any).store?.userId !== user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // Check if blocked
        if (conversation.isBlocked) {
            return NextResponse.json({ error: "Conversation is blocked" }, { status: 403 });
        }

        const message = await Message.create({
            conversationId,
            senderId: user.id,
            content,
        });

        // Update conversation timestamp
        conversation.lastMessageAt = new Date();
        await conversation.save();

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
