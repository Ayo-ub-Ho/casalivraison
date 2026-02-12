import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Restaurant extends Model {}

  Restaurant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      imageUrl: { type: DataTypes.STRING },
      isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
      prepTimeMin: { type: DataTypes.INTEGER, defaultValue: 25 },
    },
    {
      sequelize,
      tableName: "restaurants",
      modelName: "Restaurant",
      timestamps: true,
    },
  );

  return Restaurant;
};
