"use strict";
const { randomUUID } = require("crypto");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("restaurants", [
      {
        id: randomUUID(),
        name: "Le Marrakech Gourmet",
        category: "Marocain",
        description:
          "Cuisine marocaine premium : tajines, grillades, pastillas.",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
        isOpen: true,
        prepTimeMin: 30,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Sushi Anfa",
        category: "Asiatique",
        description: "Sushi frais, bowls et ramen.",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        isOpen: true,
        prepTimeMin: 25,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Street Food Gauthier",
        category: "Street Food",
        description: "Burgers, wraps et frites maison.",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        isOpen: false,
        prepTimeMin: 20,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Healthy Maârif",
        category: "Healthy",
        description: "Salades premium, bowls protéinés.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        isOpen: true,
        prepTimeMin: 18,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("restaurants", null, {});
  },
};
