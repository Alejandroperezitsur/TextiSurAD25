import { NextRequest, NextResponse } from "next/server";
import { Conversation, Message, User, Store, Product } from "@/models";
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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversation = await Conversation.findByPk(id, {
            include: [
                { model: Store, as: "store", attributes: ["id", "name", "logo", "userId"] },
                { model: User, as: "buyer", attributes: ["id", "name", "avatarUrl"] },
                { model: Product, as: "product", attributes: ["id", "name", "imageUrl", "price"] },
                {
                    model: Message,
                    as: "messages",
                    include: [{ model: User, as: "sender", attributes: ["id", "name", "avatarUrl", "role"] }],
                    order: [["createdAt", "ASC"]]
                }
            ],
            order: [[{ model: Message, as: "messages" }, "createdAt", "ASC"]],
        });

        if (!conversation) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Security check
        const isBuyer = conversation.buyerId === user.id;
        const storeOwnerId = (conversation as any).store?.userId;

        if (!isBuyer && storeOwnerId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
