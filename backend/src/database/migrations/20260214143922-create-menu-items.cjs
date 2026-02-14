"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("menu_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      restaurantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "restaurants", key: "id" },
        onDelete: "CASCADE",
      },
      menuCategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "menu_categories", key: "id" },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("menu_items");
  },
};
