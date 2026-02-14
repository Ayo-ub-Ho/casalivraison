import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Order extends Model {}

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      restaurantId: { type: DataTypes.UUID, allowNull: false },

      status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "DELIVERED", "CANCELED"),
        allowNull: false,
        defaultValue: "PENDING",
      },

      notes: { type: DataTypes.TEXT, allowNull: true },

      subtotal: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      deliveryFee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 15,
      },
      total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      tableName: "orders",
      modelName: "Order",
      timestamps: true,
    },
  );

  return Order;
};
