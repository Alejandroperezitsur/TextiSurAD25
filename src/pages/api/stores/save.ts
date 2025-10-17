import type { NextApiRequest, NextApiResponse } from "next";
import Store from "@/models/Store";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { userId, storeId, data } = req.body as {
    userId?: number;
    storeId?: number;
    data: Partial<{
      name: string;
      description: string;
      address: string;
      phone: string;
      email: string;
      logo: string;
      slug: string;
    }>;
  };

  try {
    let store: Store | null = null as any;

    if (storeId) {
      store = await Store.findByPk(Number(storeId));
    } else if (userId) {
      const user = await User.findByPk(Number(userId));
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const uid = Number((user as any)?.getDataValue?.("id") ?? (user as any)?.dataValues?.id ?? (user as any)?.get?.("id") ?? (user as any)?.id);
      store = await Store.findOne({ where: { userId: uid } });
    }

    if (!store) {
      return res.status(404).json({ message: "Tienda no encontrada" });
    }

    await store.update({
      name: data.name ?? store.name,
      description: data.description ?? store.description,
      address: data.address ?? store.address,
      phone: data.phone ?? store.phone,
      email: data.email ?? store.email,
      logo: data.logo ?? store.logo,
      slug: data.slug ?? store.slug,
    });

    return res.status(200).json({ store });
  } catch (error) {
    console.error("Error en /api/stores/save:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}