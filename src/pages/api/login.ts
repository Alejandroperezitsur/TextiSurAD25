import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Cambia esto por una variable de entorno segura

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Correo y contraseña son obligatorios" });
  }

  try {
    console.log("Intentando iniciar sesión con:", email);
    
    // Buscar al usuario por correo
    const user = await User.findOne({ where: { email } });
    
    console.log("Usuario encontrado:", user ? "Sí" : "No");

    // Verificar que el usuario exista
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    
    // Verificar que el campo password no sea nulo
    if (!user.password) {
      console.error(
        "El usuario no tiene una contraseña válida en la base de datos.",
      );
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }, // El token expira en 1 hora
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
