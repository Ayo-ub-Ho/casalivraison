"use strict";
const { randomUUID } = require("crypto");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [restaurants] = await queryInterface.sequelize.query(
      "SELECT id, name FROM restaurants;",
    );
    const restByName = Object.fromEntries(
      restaurants.map((r) => [r.name, r.id]),
    );

    const [cats] = await queryInterface.sequelize.query(
      'SELECT id, "restaurantId", name FROM menu_categories;',
    );

    // key: `${restaurantId}:${categoryName}`
    const catMap = {};
    for (const c of cats) {
      catMap[`${c.restaurantId}:${c.name}`] = c.id;
    }

    const items = [
      // Marrakech -> Tajines
      {
        id: randomUUID(),
        restaurantId: restByName["Le Marrakech Gourmet"],
        menuCategoryId: catMap[`${restByName["Le Marrakech Gourmet"]}:Tajines`],
        name: "Tajine Poulet Citron",
        description: "Poulet, citron confit, olives.",
        price: 79,
        imageUrl: "https://picsum.photos/800/500?tagine=1",
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: restByName["Le Marrakech Gourmet"],
        menuCategoryId: catMap[`${restByName["Le Marrakech Gourmet"]}:Tajines`],
        name: "Tajine Kefta",
        description: "Boulettes, sauce tomate, œufs.",
        price: 69,
        imageUrl: "https://picsum.photos/800/500?tagine=2",
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },

      // Sushi Anfa -> Sushi
      {
        id: randomUUID(),
        restaurantId: restByName["Sushi Anfa"],
        menuCategoryId: catMap[`${restByName["Sushi Anfa"]}:Sushi`],
        name: "California Saumon",
        description: "8 pièces, saumon, avocat.",
        price: 95,
        imageUrl: "https://picsum.photos/800/500?sushi=1",
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: restByName["Sushi Anfa"],
        menuCategoryId: catMap[`${restByName["Sushi Anfa"]}:Bowls`],
        name: "Poké Bowl Thon",
        description: "Riz, thon, edamame, sauce maison.",
        price: 89,
        imageUrl: "https://picsum.photos/800/500?bowl=1",
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      // Healthy Maârif -> Salades
      {
        id: randomUUID(),
        restaurantId: restByName["Healthy Maârif"],
        menuCategoryId: catMap[`${restByName["Healthy Maârif"]}:Salades`],
        name: "Salade César Poulet",
        description: "Poulet grillé, parmesan, sauce césar.",
        price: 65,
        imageUrl: "https://picsum.photos/800/500?salad=1",
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        restaurantId: restByName["Healthy Maârif"],
        menuCategoryId: catMap[`${restByName["Healthy Maârif"]}:Protein Bowls`],
        name: "Protein Bowl Poulet",
        description: "Riz, poulet, légumes, sauce maison.",
        price: 75,
        imageUrl: "https://picsum.photos/800/500?bowl=2",
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const filtered = items.filter((i) => i.restaurantId && i.menuCategoryId);

    await queryInterface.bulkInsert("menu_items", filtered);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("menu_items", null, {});
  },
};
