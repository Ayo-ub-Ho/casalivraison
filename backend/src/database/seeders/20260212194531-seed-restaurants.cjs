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
        imageUrl: "https://picsum.photos/800/500?food=1",
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
        imageUrl: "https://picsum.photos/800/500?food=2",
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
        imageUrl: "https://picsum.photos/800/500?food=3",
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
        imageUrl: "https://picsum.photos/800/500?food=4",
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
