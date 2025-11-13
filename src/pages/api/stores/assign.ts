import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/models/User";
import Store from "@/models/Store";

const slugify = (text: string) =>
  text
    .toString()
    .normalize("NFD").replace(/\p{Diacritic}+/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, storeData, storeId, slug: storeSlug } = req.body as {
    email: string;
    storeData?: Partial<{
      name: string;
      description: string;
      address: string;
      phone: string;
      email: string;
      logo: string;
      slug: string;
    }>;
    storeId?: number;
    slug?: string;
  };

  if (!email) {
    return res.status(400).json({ message: "Email es obligatorio" });
  }

  try {
    // Buscar o crear usuario vendedor
    let user = await User.findOne({ where: { email } });
    if (!user) {
      const hashed = await bcrypt.hash("password123", 10);
      user = await User.create({
        name: "Juan Vendedor",
        email,
        password: hashed,
        role: "vendedor",
      });
    }

    const userId = user.id;

    // Si se pasa storeId o slug, asignar esa tienda existente al usuario
    if (storeId || storeSlug) {
      const targetStore = storeId
        ? await Store.findByPk(Number(storeId))
        : await Store.findOne({ where: { slug: String(storeSlug) } });
      if (!targetStore) {
        return res.status(404).json({ message: "Tienda especificada no encontrada" });
      }
      await targetStore.update({
        userId: user.id,
        name: storeData?.name ?? targetStore.name,
        description: storeData?.description ?? targetStore.description,
        address: storeData?.address ?? targetStore.address,
        phone: storeData?.phone ?? targetStore.phone,
        email: storeData?.email ?? targetStore.email,
        logo: storeData?.logo ?? targetStore.logo,
        slug: storeData?.slug ?? targetStore.slug,
      });
      return res.status(200).json({ message: "Tienda asignada", userId, store: targetStore });
    }

    // Buscar tienda asociada por userId
    let store = await Store.findOne({ where: { userId } });
    if (!store) {
      const name = storeData?.name || "Tienda de Juan Vendedor";
      let slug = storeData?.slug || slugify(name) || `tienda-${userId}`;
      // Garantizar unicidad del slug
      let attempt = 0;
      while (await Store.findOne({ where: { slug } })) {
        attempt += 1;
        slug = `${slug}-${attempt}`;
      }
      store = await Store.create({
        name,
        description: storeData?.description || "",
        address: storeData?.address || "",
        phone: storeData?.phone || "",
        email: storeData?.email || email,
        logo: storeData?.logo || "",
        userId,
        slug,
      });
    } else if (storeData) {
      await store.update({
        name: storeData.name ?? store.name,
        description: storeData.description ?? store.description,
        address: storeData.address ?? store.address,
        phone: storeData.phone ?? store.phone,
        email: storeData.email ?? store.email,
        logo: storeData.logo ?? store.logo,
      });
    }

    return res.status(200).json({ message: "Tienda asignada", userId, store });
  } catch (error) {
    console.error("Error en /api/stores/assign:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}