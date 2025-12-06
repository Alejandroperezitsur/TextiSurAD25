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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const message = await Message.findByPk(id, {
            include: [{ model: Conversation, as: "conversation", include: ["store"] }]
        });

        if (!message) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        // Only the recipient can mark as read
        // If sender is current user, they can't mark it as read (it's their message)
        if (message.senderId === user.id) {
            return NextResponse.json({ error: "Cannot mark own message as read" }, { status: 400 });
        }

        // Check if user is part of conversation
        const conversation = (message as any).conversation;
        const isBuyer = conversation.buyerId === user.id;
        const storeOwnerId = conversation.store?.userId;

        if (!isBuyer && storeOwnerId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        message.isRead = true;
        await message.save();

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error updating message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
