import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import sequelize from "@/lib/sequelize";

// Asegurarse de que Sequelize esté sincronizado
sequelize.sync();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { name, email, password, role, avatarUrl } = req.body;

  // Validaciones de datos (clases de equivalencia y valores al límite)
  if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
    return res.status(400).json({ message: "El nombre debe tener entre 2 y 50 caracteres" });
  }
  if (!email || typeof email !== "string" || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Correo electrónico inválido" });
  }
  if (!password || typeof password !== "string" || password.length < 6 || password.length > 32) {
    return res.status(400).json({ message: "La contraseña debe tener entre 6 y 32 caracteres" });
  }
  if (!role || (role !== "comprador" && role !== "vendedor")) {
    return res.status(400).json({ message: "El rol debe ser 'comprador' o 'vendedor'" });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const userData: any = { name, email, password: hashedPassword, role };
    if (avatarUrl) userData.avatarUrl = avatarUrl;

    const newUser = await User.create(userData);

    return res
      .status(201)
      .json({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
