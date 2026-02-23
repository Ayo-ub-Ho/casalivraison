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
        imageUrl: "https://images.unsplash.com/photo-1604326531570-9b47b5afc98b?w=800&q=80",
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
        imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
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
        imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80",
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
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1670333242712-6e95c863592b?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
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
        imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
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
