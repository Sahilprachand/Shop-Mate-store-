import Razorpay from "razorpay";
import "dotenv/config";

// only initialize if keys are present, so the app doesn't crash for
// people who haven't set up Razorpay yet (Cash on Delivery still works)
export const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;
