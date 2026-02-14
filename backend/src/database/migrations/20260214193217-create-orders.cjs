"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },

      restaurantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "restaurants", key: "id" },
        onDelete: "RESTRICT",
      },

      status: {
        type: Sequelize.ENUM("PENDING", "CONFIRMED", "DELIVERED", "CANCELED"),
        allowNull: false,
        defaultValue: "PENDING",
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },

      deliveryFee: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 15,
      },

      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex("orders", ["userId"]);
    await queryInterface.addIndex("orders", ["restaurantId"]);
    await queryInterface.addIndex("orders", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_orders_status";',
    );
  },
};
