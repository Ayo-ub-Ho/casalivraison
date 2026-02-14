import sequelize from "../config/db.js";
import RestaurantFactory from "./Restaurant.js";
import MenuCategoryFactory from "./MenuCategory.js";
import MenuItemFactory from "./MenuItem.js";

const db = {};
db.sequelize = sequelize;

db.Restaurant = RestaurantFactory(sequelize);
db.MenuCategory = MenuCategoryFactory(sequelize);
db.MenuItem = MenuItemFactory(sequelize);

/* Associations */

db.Restaurant.hasMany(db.MenuCategory, { foreignKey: "restaurantId" });
db.MenuCategory.belongsTo(db.Restaurant, { foreignKey: "restaurantId" });

db.Restaurant.hasMany(db.MenuItem, { foreignKey: "restaurantId" });
db.MenuItem.belongsTo(db.Restaurant, { foreignKey: "restaurantId" });

db.MenuCategory.hasMany(db.MenuItem, { foreignKey: "menuCategoryId" });
db.MenuItem.belongsTo(db.MenuCategory, { foreignKey: "menuCategoryId" });

export default db;
