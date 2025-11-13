import type { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/sequelize";
import Product from "@/models/Product";
import Store from "@/models/Store";
import User from "@/models/User";
import emitter from "@/lib/events";

type StatusType = "Activo" | "Inactivo";

interface CreateProductBody {
  userEmail: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  status?: StatusType;
  category?: string;
  sizes?: string | string[];
  hint?: string;
  hasDelivery?: boolean;
  rating?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.sync({ alter: true });

  if (req.method === "GET") {
    try {
      const { storeSlug, storeId, userEmail } = req.query as { storeSlug?: string; storeId?: string; userEmail?: string };
      const where: { storeId?: number } = {};
      if (storeId) {
        where.storeId = Number(storeId);
      } else if (storeSlug) {
        const store = await Store.findOne({ where: { slug: String(storeSlug) } });
        if (!store) return res.status(404).json({ message: "Tienda no encontrada" });
        where.storeId = store.id;
      } else if (userEmail) {
        const user = await User.findOne({ where: { email: String(userEmail) } });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        const store = await Store.findOne({ where: { userId: user.id } });
        if (!store) return res.status(200).json({ products: [] });
        where.storeId = store.id;
      }

      const products = await Product.findAll({ where, order: [["updatedAt", "DESC"]] });
      return res.status(200).json({ products });
    } catch (error) {
      console.error("GET /api/products error", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body as CreateProductBody;
      const { userEmail } = data;
      if (!userEmail) return res.status(400).json({ message: "userEmail requerido" });

      const user = await User.findOne({ where: { email: String(userEmail) } });
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      const store = await Store.findOne({ where: { userId: user.id } });
      if (!store) return res.status(400).json({ message: "El usuario no tiene tienda asignada" });

      const created = await Product.create({
        name: String(data.name),
        description: data.description ? String(data.description) : undefined,
        price: Number(data.price),
        imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
        stock: Number(data.stock ?? 0),
        status: data.status === "Inactivo" ? "Inactivo" : "Activo",
        category: data.category ? String(data.category) : undefined,
        sizes: Array.isArray(data.sizes) ? JSON.stringify(data.sizes) : data.sizes,
        hint: data.hint ? String(data.hint) : undefined,
        hasDelivery: typeof data.hasDelivery === "boolean" ? data.hasDelivery : true,
        rating: typeof data.rating === "number" ? data.rating : 4.5,
        storeId: store.id,
      });

      emitter.emit("products:update", { type: "create", product: created });
      return res.status(201).json({ product: created });
    } catch (error) {
      console.error("POST /api/products error", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  res.status(405).json({ message: "Método no permitido" });
}