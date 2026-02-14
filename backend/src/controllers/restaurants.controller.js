import db from "../models/index.js";

export const listRestaurants = async (req, res, next) => {
  try {
    const { category, isOpen } = req.query;

    const where = {};
    if (category) where.category = category;
    if (isOpen !== undefined) where.isOpen = isOpen === "true";

    const restaurants = await db.Restaurant.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

export const getRestaurantMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await db.Restaurant.findByPk(id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const categories = await db.MenuCategory.findAll({
      where: { restaurantId: id },
      order: [
        ["sortOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
      include: [
        {
          model: db.MenuItem,
          where: { restaurantId: id },
          required: false,
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    res.json({ restaurant, categories });
  } catch (err) {
    next(err);
  }
};
