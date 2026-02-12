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
