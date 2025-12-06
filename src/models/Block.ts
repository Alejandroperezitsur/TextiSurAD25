import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";

interface BlockAttributes {
    id: number;
    blockerId: number;
    blockedId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type BlockCreationAttributes = Optional<BlockAttributes, "id" | "createdAt" | "updatedAt">;

class Block extends Model<BlockAttributes, BlockCreationAttributes> implements BlockAttributes {
    declare id: number;
    declare blockerId: number;
    declare blockedId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Block.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        blockerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        blockedId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Block",
        tableName: "blocks",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["blockerId", "blockedId"],
            },
        ],
    },
);

export default Block;
