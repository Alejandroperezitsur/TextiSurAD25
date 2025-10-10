"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await queryInterface.bulkInsert("users", [
      {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword, // Contraseña encriptada
        role: "comprador",
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
