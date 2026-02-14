import db from "../models/index.js";

export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await db.MenuItem.findByPk(id, {
      include: [{ model: db.Restaurant }, { model: db.MenuCategory }],
    });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
};
