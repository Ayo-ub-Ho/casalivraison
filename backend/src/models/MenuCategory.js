import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class MenuCategory extends Model {}

  MenuCategory.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "menu_categories",
      timestamps: true,
    },
  );

  return MenuCategory;
};
