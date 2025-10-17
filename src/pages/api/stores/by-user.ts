import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import Store from "@/models/Store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, userId } = req.query as { email?: string; userId?: string };

  try {
    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (userId) {
      user = await User.findByPk(Number(userId));
    } else {
      return res.status(400).json({ message: "Parámetros faltantes" });
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const uid = Number((user as any)?.getDataValue?.("id") ?? (user as any)?.dataValues?.id ?? (user as any)?.get?.("id") ?? (user as any)?.id);
    const store = await Store.findOne({ where: { userId: uid } });
    if (!store) {
      return res.status(404).json({ message: "Tienda no encontrada para el usuario" });
    }

    return res.status(200).json({ store });
  } catch (error) {
    console.error("Error en /api/stores/by-user:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}