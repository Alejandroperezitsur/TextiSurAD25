import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";

interface StoreAttributes {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  userId: number;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreCreationAttributes = Optional<
  StoreAttributes,
  | "id"
  | "description"
  | "address"
  | "phone"
  | "email"
  | "logo"
  | "createdAt"
  | "updatedAt"
>;

class Store
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements StoreAttributes
{
  declare id: number;
  declare name: string;
  declare description?: string;
  declare address?: string;
  declare phone?: string;
  declare email?: string;
  declare logo?: string;
  declare userId: number;
  declare slug: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.STRING(255),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    logo: {
      type: DataTypes.STRING(255),
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Store",
    tableName: "stores",
    timestamps: true,
  },
);

export default Store;