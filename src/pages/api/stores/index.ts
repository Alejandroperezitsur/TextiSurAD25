import type { NextApiRequest, NextApiResponse } from "next";
import Store from "@/models/Store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const stores = await Store.findAll({ order: [["name", "ASC"]] });
    return res.status(200).json({ stores });
  } catch (error) {
    console.error("Error en /api/stores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}