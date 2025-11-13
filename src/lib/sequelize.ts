import { Sequelize } from "sequelize";

// Configuración de Sequelize para conectarse a la base de datos local
const sequelize = new Sequelize(
  "textisur_db", // Nombre de la base de datos
  "root", // Usuario
  "root",// Contraseña
  {
    host: "localhost", // Host local
    dialect: "mysql",
    logging: true, // Activamos el logging para desarrollo
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
);

// Verificar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

export default sequelize;
