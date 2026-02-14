"use strict";
const { randomUUID } = require("crypto");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [restaurants] = await queryInterface.sequelize.query(
      "SELECT id, name FROM restaurants;",
    );

    const byName = Object.fromEntries(restaurants.map((r) => [r.name, r.id]));

    const categories = [
      // Le Marrakech Gourmet
      {
        id: randomUUID(),
        restaurantId: byName["Le Marrakech Gourmet"],
        name: "Tajines",
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: byName["Le Marrakech Gourmet"],
        name: "Grillades",
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Sushi Anfa
      {
        id: randomUUID(),
        restaurantId: byName["Sushi Anfa"],
        name: "Sushi",
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: byName["Sushi Anfa"],
        name: "Bowls",
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Street Food Gauthier
      {
        id: randomUUID(),
        restaurantId: byName["Street Food Gauthier"],
        name: "Burgers",
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: byName["Street Food Gauthier"],
        name: "Wraps",
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      },

      // Healthy Maârif
      {
        id: randomUUID(),
        restaurantId: byName["Healthy Maârif"],
        name: "Salades",
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: byName["Healthy Maârif"],
        name: "Protein Bowls",
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const filtered = categories.filter((c) => !!c.restaurantId);

    await queryInterface.bulkInsert("menu_categories", filtered);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("menu_categories", null, {});
  },
};
