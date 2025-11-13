import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";
import Store from "@/models/Store";

interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  status: "Activo" | "Inactivo";
  category?: string;
  sizes?: string; // JSON string
  hint?: string;
  hasDelivery?: boolean;
  rating?: number;
  storeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  | "id"
  | "description"
  | "imageUrl"
  | "category"
  | "sizes"
  | "hint"
  | "hasDelivery"
  | "rating"
  | "createdAt"
  | "updatedAt"
>;

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare imageUrl?: string;
  declare stock: number;
  declare status: "Activo" | "Inactivo";
  declare category?: string;
  declare sizes?: string;
  declare hint?: string;
  declare hasDelivery?: boolean;
  declare rating?: number;
  declare storeId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Activo", "Inactivo"),
      allowNull: false,
      defaultValue: "Activo",
    },
    category: {
      type: DataTypes.STRING(100),
    },
    sizes: {
      type: DataTypes.TEXT,
    },
    hint: {
      type: DataTypes.STRING(100),
    },
    hasDelivery: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    indexes: [
      { fields: ["storeId"] },
      { fields: ["status"] },
      { fields: ["category"] },
    ],
  },
);

Store.hasMany(Product, { foreignKey: "storeId", as: "products" });
Product.belongsTo(Store, { foreignKey: "storeId", as: "store" });

export default Product;