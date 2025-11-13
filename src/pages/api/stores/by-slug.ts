import type { NextApiRequest, NextApiResponse } from "next";
import Store from "@/models/Store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { slug } = req.query as { slug?: string };
  if (!slug) return res.status(400).json({ message: "Slug requerido" });

  try {
    const store = await Store.findOne({ where: { slug: String(slug) } });
    if (!store) return res.status(404).json({ message: "Tienda no encontrada" });
    return res.status(200).json({ store });
  } catch (error) {
    console.error("Error en /api/stores/by-slug:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}