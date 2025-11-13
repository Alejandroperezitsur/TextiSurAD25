import type { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/sequelize";
import Product from "@/models/Product";
import emitter from "@/lib/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await sequelize.sync({ alter: true });

  const { id } = req.query as { id?: string };
  const pid = Number(id);
  if (!pid) return res.status(400).json({ message: "ID inválido" });

  if (req.method === "GET") {
    try {
      const product = await Product.findByPk(pid);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      return res.status(200).json({ product });
    } catch (error) {
      console.error("GET /api/products/[id] error", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  if (req.method === "PUT") {
    try {
      const product = await Product.findByPk(pid);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      const data = req.body as Record<string, unknown>;
      const updated = await product.update({
        name: typeof data.name === "string" ? data.name : product.name,
        description: typeof data.description === "string" ? data.description : product.description,
        price: typeof data.price === "number" ? data.price : product.price,
        imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : product.imageUrl,
        stock: typeof data.stock === "number" ? data.stock : product.stock,
        status: data.status === "Inactivo" || data.status === "Activo" ? (data.status as "Activo" | "Inactivo") : product.status,
        category: typeof data.category === "string" ? data.category : product.category,
        sizes: Array.isArray(data.sizes) ? JSON.stringify(data.sizes) : typeof data.sizes === "string" ? data.sizes : product.sizes,
        hint: typeof data.hint === "string" ? data.hint : product.hint,
        hasDelivery: typeof data.hasDelivery === "boolean" ? data.hasDelivery : product.hasDelivery,
        rating: typeof data.rating === "number" ? data.rating : product.rating,
      });

      emitter.emit("products:update", { type: "update", product: updated });
      return res.status(200).json({ product: updated });
    } catch (error) {
      console.error("PUT /api/products/[id] error", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const product = await Product.findByPk(pid);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      await product.destroy();
      emitter.emit("products:update", { type: "delete", id: pid });
      return res.status(204).end();
    } catch (error) {
      console.error("DELETE /api/products/[id] error", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}