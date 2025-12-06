import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";

interface MessageAttributes {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

type MessageCreationAttributes = Optional<
    MessageAttributes,
    "id" | "isRead" | "createdAt" | "updatedAt"
>;

class Message
    extends Model<MessageAttributes, MessageCreationAttributes>
    implements MessageAttributes {
    declare id: number;
    declare conversationId: number;
    declare senderId: number;
    declare content: string;
    declare isRead: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "Message",
        tableName: "messages",
        timestamps: true,
    },
);

export default Message;
