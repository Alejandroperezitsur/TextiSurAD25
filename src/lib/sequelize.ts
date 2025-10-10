import { Sequelize } from "sequelize";

// Configuración de Sequelize para conectarse a la base de datos local
const sequelize = new Sequelize(
  "textisur_db", // Nombre de la base de datos
  "textisur", // Usuario
  "SQL55H7#",// Contraseña
  {
    host: "localhost", // Host local
    dialect: "mysql",
    logging: false, // Desactiva el logging de Sequelize
  },
);

export default sequelize;
