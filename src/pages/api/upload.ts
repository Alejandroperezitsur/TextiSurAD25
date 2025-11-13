import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { dataUrl } = req.body as { dataUrl?: string };
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return res.status(400).json({ message: "Imagen inválida" });
    }

    const match = dataUrl.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i);
    if (!match) {
      return res.status(400).json({ message: "Formato de imagen no soportado" });
    }

    const mime = match[1].toLowerCase();
    const base64 = match[3];
    const buffer = Buffer.from(base64, "base64");

    const ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    return res.status(201).json({ url });
  } catch (error) {
    console.error("POST /api/upload error", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

