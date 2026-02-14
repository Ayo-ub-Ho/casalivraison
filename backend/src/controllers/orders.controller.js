import db from "../models/index.js";

const DELIVERY_FEE_DEFAULT = 15;

export const createOrder = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { phone, fullName, restaurantId, items, notes } = req.body;

    // Basic validation
    if (!phone || typeof phone !== "string") {
      await t.rollback();
      return res.status(400).json({ message: "phone is required" });
    }
    if (!restaurantId) {
      await t.rollback();
      return res.status(400).json({ message: "restaurantId is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "items must be a non-empty array" });
    }

    // Ensure restaurant exists
    const restaurant = await db.Restaurant.findByPk(restaurantId, {
      transaction: t,
    });
    if (!restaurant) {
      await t.rollback();
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find or create user
    const [user] = await db.User.findOrCreate({
      where: { phone },
      defaults: { phone, fullName: fullName || null },
      transaction: t,
    });

    // Fetch menu items (and validate they belong to the same restaurant)
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await db.MenuItem.findAll({
      where: { id: menuItemIds, restaurantId },
      transaction: t,
    });

    if (menuItems.length !== menuItemIds.length) {
      await t.rollback();
      return res.status(400).json({
        message:
          "Some items are invalid or do not belong to the selected restaurant",
      });
    }

    // Build a map for quick lookup
    const menuItemMap = new Map(menuItems.map((mi) => [mi.id, mi]));

    // Compute subtotal + prepare order_items rows
    let subtotal = 0;
    const orderItemsPayload = items.map((i) => {
      const qty = Number(i.quantity || 1);
      if (!i.menuItemId || !Number.isInteger(qty) || qty <= 0) {
        throw new Error("Invalid items payload (menuItemId/quantity)");
      }

      const mi = menuItemMap.get(i.menuItemId);
      const unitPrice = Number(mi.price);
      const totalPrice = unitPrice * qty;

      subtotal += totalPrice;

      return {
        menuItemId: mi.id,
        quantity: qty,
        unitPrice,
        totalPrice,
      };
    });

    const deliveryFee = DELIVERY_FEE_DEFAULT;
    const total = subtotal + deliveryFee;

    // Create order
    const order = await db.Order.create(
      {
        userId: user.id,
        restaurantId,
        status: "PENDING",
        notes: notes || null,
        subtotal,
        deliveryFee,
        total,
      },
      { transaction: t },
    );

    // Create order_items
    await db.OrderItem.bulkCreate(
      orderItemsPayload.map((oi) => ({ ...oi, orderId: order.id })),
      { transaction: t },
    );

    await t.commit();

    // Return order with items
    const created = await db.Order.findByPk(order.id, {
      include: [
        { model: db.Restaurant },
        { model: db.User, attributes: ["id", "phone", "fullName"] },
        {
          model: db.OrderItem,
          include: [{ model: db.MenuItem }],
        },
      ],
      order: [[db.OrderItem, "createdAt", "ASC"]],
    });

    return res.status(201).json(created);
  } catch (err) {
    await t.rollback();
    // Better error message for invalid payload
    if (err.message?.includes("Invalid items payload")) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};
