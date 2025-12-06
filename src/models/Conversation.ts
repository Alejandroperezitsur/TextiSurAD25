import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";

interface ConversationAttributes {
    id: number;
    buyerId: number;
    storeId: number;
    productId?: number;
    lastMessageAt: Date;
    deletedByBuyer?: boolean;
    deletedByStore?: boolean;
    isReported?: boolean;
    isBlocked?: boolean;
    blockedBy?: number;
    lastTypingAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

type ConversationCreationAttributes = Optional<
    ConversationAttributes,
    "id" | "lastMessageAt" | "deletedByBuyer" | "deletedByStore" | "isReported" | "isBlocked" | "blockedBy" | "lastTypingAt" | "createdAt" | "updatedAt"
>;

class Conversation
    extends Model<ConversationAttributes, ConversationCreationAttributes>
    implements ConversationAttributes {
    declare id: number;
    declare buyerId: number;
    declare storeId: number;
    declare lastMessageAt: Date;
    declare productId?: number;
    declare deletedByBuyer: boolean;
    declare deletedByStore: boolean;
    declare isReported: boolean;
    declare isBlocked: boolean;
    declare blockedBy?: number;
    declare lastTypingAt?: Date;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly product?: any; // Association mixin type
}

Conversation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        buyerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        storeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        lastMessageAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deletedByBuyer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deletedByStore: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isReported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        blockedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        lastTypingAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Conversation",
        tableName: "conversations",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["buyerId", "storeId", "productId"], // Composite unique including product
            },
        ],
    },
);

export default Conversation;
