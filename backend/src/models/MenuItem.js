import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class MenuItem extends Model {}

  MenuItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      restaurantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      menuCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      imageUrl: DataTypes.STRING,
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "menu_items",
      timestamps: true,
    },
  );

  return MenuItem;
};
