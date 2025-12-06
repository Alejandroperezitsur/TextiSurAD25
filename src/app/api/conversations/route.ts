import { NextRequest, NextResponse } from "next/server";
import { Conversation, Store, User, Message, Product } from "@/models";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

// Helper to get user from token (Duplicated logic, maybe refactor later)
async function getUser(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro");
        return decoded; // { id, email, role, ... }
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let whereClause: any = {};
        if (user.role === "comprador") {
            whereClause = {
                buyerId: user.id,
                deletedByBuyer: false
            };
        } else if (user.role === "vendedor") {
            const stores = await Store.findAll({ where: { userId: user.id } });
            const storeIds = stores.map(s => s.id);
            whereClause = {
                storeId: { [Op.in]: storeIds },
                deletedByStore: false
            };
        }

        const conversations = await Conversation.findAll({
            where: whereClause,
            include: [
                { model: Store, as: "store", attributes: ["id", "name", "logo"] },
                { model: User, as: "buyer", attributes: ["id", "name", "avatarUrl"] },
                { model: Product, as: "product", attributes: ["id", "name", "imageUrl", "price"] },
                {
                    model: Message,
                    as: "messages",
                    limit: 1,
                    order: [["createdAt", "DESC"]]
                }
            ],
            order: [["lastMessageAt", "DESC"]],
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getUser(req);
        if (!user || user.role !== "comprador") {
            return NextResponse.json({ error: "Unauthorized or not a buyer" }, { status: 401 });
        }

        const body = await req.json();
        const { storeId, initialMessage, productId } = body;

        if (!storeId || !initialMessage) {
            return NextResponse.json({ error: "Missing storeId or initialMessage" }, { status: 400 });
        }

        // Check if conversation exists
        let conversation = await Conversation.findOne({
            where: {
                buyerId: user.id,
                storeId: storeId,
                productId: productId || null,
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                buyerId: user.id,
                storeId: storeId,
                productId: productId || null,
                lastMessageAt: new Date(),
            });
        } else {
            // Un-delete if previously deleted?
            // If buyer had deleted it, restore it.
            if (conversation.deletedByBuyer) {
                await conversation.update({ deletedByBuyer: false });
            }
            // If store had deleted it, restore it so they see the new message
            if (conversation.deletedByStore) {
                await conversation.update({ deletedByStore: false });
            }

            conversation.lastMessageAt = new Date();
            await conversation.save();
        }

        // Create message
        await Message.create({
            conversationId: conversation.id,
            senderId: user.id,
            content: initialMessage,
        });

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
