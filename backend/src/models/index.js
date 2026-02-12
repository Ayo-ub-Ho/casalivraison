import sequelize from "../config/db.js";
import RestaurantFactory from "./Restaurant.js";

const db = {};
db.sequelize = sequelize;
db.Restaurant = RestaurantFactory(sequelize);

export default db;
