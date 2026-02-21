import sequelize from "../config/db.js";

// factories
import RestaurantFactory from "./Restaurant.js";
import MenuCategoryFactory from "./MenuCategory.js";
import MenuItemFactory from "./MenuItem.js";

import UserFactory from "./User.js";
import OrderFactory from "./Order.js";
import OrderItemFactory from "./OrderItem.js";
import OtpCode from "./otpCode.js";
const db = {};
db.sequelize = sequelize;

// catalog
db.Restaurant = RestaurantFactory(sequelize);
db.MenuCategory = MenuCategoryFactory(sequelize);
db.MenuItem = MenuItemFactory(sequelize);

// orders
db.User = UserFactory(sequelize);
db.Order = OrderFactory(sequelize);
db.OrderItem = OrderItemFactory(sequelize);

// auth
db.OtpCode = OtpCode;
/* ========= Associations ========= */

// Restaurant ↔ Menu
db.Restaurant.hasMany(db.MenuCategory, { foreignKey: "restaurantId" });
db.MenuCategory.belongsTo(db.Restaurant, { foreignKey: "restaurantId" });

db.Restaurant.hasMany(db.MenuItem, { foreignKey: "restaurantId" });
db.MenuItem.belongsTo(db.Restaurant, { foreignKey: "restaurantId" });

db.MenuCategory.hasMany(db.MenuItem, { foreignKey: "menuCategoryId" });
db.MenuItem.belongsTo(db.MenuCategory, { foreignKey: "menuCategoryId" });

// User ↔ Orders
db.User.hasMany(db.Order, { foreignKey: "userId" });
db.Order.belongsTo(db.User, { foreignKey: "userId" });

// Restaurant ↔ Orders
db.Restaurant.hasMany(db.Order, { foreignKey: "restaurantId" });
db.Order.belongsTo(db.Restaurant, { foreignKey: "restaurantId" });

// Order ↔ OrderItems
db.Order.hasMany(db.OrderItem, { foreignKey: "orderId" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "orderId" });

// MenuItem ↔ OrderItems
db.MenuItem.hasMany(db.OrderItem, { foreignKey: "menuItemId" });
db.OrderItem.belongsTo(db.MenuItem, { foreignKey: "menuItemId" });

export default db;
