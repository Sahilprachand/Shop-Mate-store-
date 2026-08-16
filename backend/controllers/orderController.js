import { sql } from "../config/db.js";

// creates an order + its line items in a single transaction-like sequence,
// then decrements stock for each purchased product
export const createOrder = async (req, res) => {
  const { customerName, email, address, city, zipCode, paymentMethod, items } = req.body;

  if (!customerName || !email || !address || !city || !zipCode) {
    return res.status(400).json({ success: false, message: "All shipping fields are required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  try {
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const [order] = await sql`
      INSERT INTO orders (customer_name, email, address, city, zip_code, payment_method, total)
      VALUES (
        ${customerName},
        ${email},
        ${address},
        ${city},
        ${zipCode},
        ${paymentMethod || "Cash on Delivery"},
        ${total}
      )
      RETURNING *
    `;

    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES (${order.id}, ${item.id}, ${item.name}, ${item.price}, ${item.quantity})
      `;

      // best-effort stock decrement, never let it below zero
      await sql`
        UPDATE products
        SET stock = GREATEST(stock - ${item.quantity}, 0)
        WHERE id = ${item.id}
      `;
    }

    res.status(201).json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.log("Error in createOrder function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log("Error in getOrders function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const items = await sql`SELECT * FROM order_items WHERE order_id = ${id}`;
    res.status(200).json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.log("Error in getOrder function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// public order tracking — requires the email used at checkout to match,
// so people can't view a stranger's order just by guessing the order ID
export const trackOrder = async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required to track an order" });
  }

  try {
    const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
    if (!order || order.email.toLowerCase() !== String(email).toLowerCase()) {
      return res.status(404).json({
        success: false,
        message: "No order found with that Order ID and email combination",
      });
    }
    const items = await sql`SELECT * FROM order_items WHERE order_id = ${id}`;
    res.status(200).json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.log("Error in trackOrder function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const VALID_STATUSES = ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  try {
    const [order] = await sql`
      UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *
    `;
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.log("Error in updateOrderStatus function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
