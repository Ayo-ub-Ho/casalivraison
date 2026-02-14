import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class OrderItem extends Model {}

  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: { type: DataTypes.UUID, allowNull: false },
      menuItemId: { type: DataTypes.UUID, allowNull: false },

      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },

      unitPrice: { type: DataTypes.FLOAT, allowNull: false },
      totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      tableName: "order_items",
      modelName: "OrderItem",
      timestamps: true,
    },
  );

  return OrderItem;
};
