import crypto from "crypto";
import { razorpay } from "../lib/razorpay.js";

// creates a Razorpay order for the given amount (in rupees) so the
// frontend can open the Razorpay Checkout widget against it
export const createRazorpayOrder = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      success: false,
      message: "Razorpay is not configured on the server yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env",
    });
  }

  const { amount } = req.body; // amount in rupees
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.log("Error creating Razorpay order", error);
    res.status(500).json({ success: false, message: "Could not create payment order" });
  }
};

// verifies the payment signature Razorpay sends back after a successful
// payment, to confirm it wasn't tampered with client-side
export const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment details" });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }

  res.status(200).json({ success: true, message: "Payment verified" });
};
