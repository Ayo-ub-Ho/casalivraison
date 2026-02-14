"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "orders", key: "id" },
        onDelete: "CASCADE",
      },

      menuItemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "menu_items", key: "id" },
        onDelete: "RESTRICT",
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      unitPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
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

    await queryInterface.addIndex("order_items", ["orderId"]);
    await queryInterface.addIndex("order_items", ["menuItemId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  },
};
