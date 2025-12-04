import User from "./User";
import Store from "./Store";
import Product from "./Product";
import Order from "./Order";

// Define associations
User.hasMany(Store, { foreignKey: "userId", as: "stores" });
Store.belongsTo(User, { foreignKey: "userId", as: "owner" });

Store.hasMany(Product, { foreignKey: "storeId", as: "products" });
Product.belongsTo(Store, { foreignKey: "storeId", as: "store" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(Order, { foreignKey: "productId", as: "orders" });
Order.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Export models
export { User, Store, Product, Order };
