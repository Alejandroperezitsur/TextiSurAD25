import type { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/sequelize";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import Store from "@/models/Store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.sync({ alter: true });

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { userEmail, userId, storeSlug, storeId } = req.query as { userEmail?: string; userId?: string; storeSlug?: string; storeId?: string };

    let userIdFilter: number | undefined;
    let storeIdFilter: number | undefined;

    if (userEmail) {
      const user = await User.findOne({ where: { email: String(userEmail) } });
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      userIdFilter = user.id;
    } else if (userId) {
      const user = await User.findByPk(Number(userId));
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      userIdFilter = user.id;
    }

    if (storeSlug) {
      const store = await Store.findOne({ where: { slug: String(storeSlug) } });
      if (!store) return res.status(404).json({ message: "Tienda no encontrada" });
      storeIdFilter = store.id;
    } else if (storeId) {
      const store = await Store.findByPk(Number(storeId));
      if (!store) return res.status(404).json({ message: "Tienda no encontrada" });
      storeIdFilter = store.id;
    }

    const include = [
      { model: User, as: "user", attributes: ["name", "email"] },
      {
        model: Product,
        as: "product",
        attributes: ["name", "price", "storeId"],
        ...(storeIdFilter ? { where: { storeId: storeIdFilter }, required: true } : {}),
        include: [{ model: Store, as: "store", attributes: ["name", "city"] }],
      },
    ];

    const rows = await Order.findAll({ where: userIdFilter ? { userId: userIdFilter } : undefined, include, order: [["createdAt", "DESC"]] });

    const orders = rows.map((o) => ({
      id: o.id,
      cantidad: o.quantity,
      total: Number(o.total),
      estado: o.status,
      fecha: o.createdAt,
      user: { nombre: (o as any).user?.name ?? "", email: (o as any).user?.email ?? "" },
      product: { nombre: (o as any).product?.name ?? "", price: Number((o as any).product?.price ?? 0) },
      store: { nombre: (o as any).product?.store?.name ?? "", city: (o as any).product?.store?.city ?? "" },
    }));

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error en /api/orders:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}