import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2Icon,
  ArrowLeftIcon,
  ZapIcon,
  BanknoteIcon,
  DownloadIcon,
  PrinterIcon,
  ShieldCheckIcon,
  PackageSearchIcon,
  QrCodeIcon,
  CheckIcon,
} from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { BASE_URL } from "../store/useProductStore";
import { handleImageError } from "../lib/imageFallback";

const UPI_ID = import.meta.env.VITE_UPI_ID;
const UPI_PAYEE_NAME = import.meta.env.VITE_UPI_PAYEE_NAME || "Shop Mate";

const PAYMENT_METHODS = [
  {
    id: "UPI QR Code",
    label: "Scan & Pay",
    icon: QrCodeIcon,
    description: "Scan with any UPI app - GPay, PhonePe, Paytm",
  },
  {
    id: "Razorpay (Online)",
    label: "Pay Online",
    icon: ZapIcon,
    description: "Card, UPI, Netbanking & Wallets via Razorpay",
  },
  {
    id: "Cash on Delivery",
    label: "Cash on Delivery",
    icon: BanknoteIcon,
    description: "Pay when your order arrives",
  },
];

function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(
    UPI_ID && UPI_ID !== "yourname@upi" ? "UPI QR Code" : "Cash on Delivery"
  );
  const [upiConfirmed, setUpiConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [orderItemsSnapshot, setOrderItemsSnapshot] = useState([]);

  const subtotal = totalPrice();
  const shipping = subtotal > 1000 ? 0 : 49;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID || "")}&pn=${encodeURIComponent(
    UPI_PAYEE_NAME
  )}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Order Payment")}`;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isFormValid = () =>
    form.customerName && form.email && form.address && form.city && form.zipCode;

  // finalizes the order in our own database once payment is confirmed
  // (or immediately, for Cash on Delivery / self-confirmed UPI)
  const placeOrder = async (extraFields = {}) => {
    const response = await axios.post(`${BASE_URL}/api/orders`, {
      ...form,
      paymentMethod,
      ...extraFields,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    });
    setOrderItemsSnapshot(items);
    setOrderPlaced(response.data.data);
    clearCart();
    toast.success("Order placed successfully!");
  };

  const payWithRazorpay = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/payment/create-order`, { amount: total });

      if (!data.success) {
        toast.error(data.message || "Payment setup failed");
        setLoading(false);
        return;
      }

      const razorpayOrder = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Shop Mate",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: form.customerName,
          email: form.email,
        },
        theme: { color: "#6419E6" },
        handler: async function (response) {
          try {
            await axios.post(`${BASE_URL}/api/payment/verify`, response);
            await placeOrder({
              razorpayPaymentId: response.razorpay_payment_id,
            });
          } catch (err) {
            console.log("Verification/order error", err);
            toast.error("Payment succeeded but order could not be saved. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      if (!window.Razorpay) {
        toast.error("Payment gateway failed to load. Check your internet connection.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error initiating Razorpay payment", error);
      toast.error(
        error.response?.data?.message || "Could not start payment. Try Cash on Delivery instead."
      );
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all shipping fields");
      return;
    }

    if (paymentMethod === "UPI QR Code" && !upiConfirmed) {
      toast.error("Please confirm you've completed the payment first");
      return;
    }

    setLoading(true);

    if (paymentMethod === "Razorpay (Online)") {
      await payWithRazorpay();
    } else {
      try {
        await placeOrder();
      } catch (error) {
        console.log("Error placing order", error);
        toast.error("Something went wrong placing your order");
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    const order = orderPlaced;

    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Shop Mate", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Tax Invoice / Bill of Sale", 14, 27);

    doc.setDrawColor(220);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Invoice #: ${order.id}`, 14, 40);
    doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString()}`, 14, 46);
    doc.text(`Payment Method: ${order.payment_method || paymentMethod}`, 14, 52);

    doc.text("Billed To:", 140, 40);
    doc.text(`${order.customer_name}`, 140, 46);
    doc.text(`${order.address}`, 140, 52);
    doc.text(`${order.city}, ${order.zip_code}`, 140, 58);
    doc.text(`${order.email}`, 140, 64);

    let y = 76;
    doc.setFillColor(245, 245, 245);
    doc.rect(14, y - 6, 182, 8, "F");
    doc.setFontSize(10);
    doc.text("Item", 16, y);
    doc.text("Qty", 130, y);
    doc.text("Price", 150, y);
    doc.text("Total", 175, y);
    y += 10;

    orderItemsSnapshot.forEach((item) => {
      doc.text(item.name.slice(0, 45), 16, y);
      doc.text(String(item.quantity), 130, y);
      doc.text(`Rs ${item.price.toFixed(2)}`, 150, y);
      doc.text(`Rs ${(item.price * item.quantity).toFixed(2)}`, 175, y);
      y += 8;
    });

    y += 4;
    doc.line(14, y, 196, y);
    y += 8;

    const subtotalCalc = orderItemsSnapshot.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCalc = subtotalCalc > 1000 ? 0 : 49;
    const taxCalc = subtotalCalc * 0.08;

    doc.text("Subtotal:", 150, y);
    doc.text(`Rs ${subtotalCalc.toFixed(2)}`, 175, y);
    y += 7;
    doc.text("Shipping:", 150, y);
    doc.text(shippingCalc === 0 ? "Free" : `Rs ${shippingCalc.toFixed(2)}`, 175, y);
    y += 7;
    doc.text("Tax:", 150, y);
    doc.text(`Rs ${taxCalc.toFixed(2)}`, 175, y);
    y += 9;

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Total:", 150, y);
    doc.text(`Rs ${Number(order.total).toFixed(2)}`, 175, y);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("This is a demo invoice generated for portfolio purposes.", 14, 280);

    doc.save(`invoice-order-${order.id}.pdf`);
  };

  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-success/10 rounded-full p-6 w-fit mx-auto mb-6">
          <CheckCircle2Icon className="size-14 text-success" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-base-content/60 mb-6">
          Thanks, {orderPlaced.customer_name}. Your order{" "}
          <span className="font-semibold">#{orderPlaced.id}</span> has been placed via{" "}
          <span className="font-semibold">{orderPlaced.payment_method}</span>. A confirmation was
          sent to {orderPlaced.email}.
        </p>

        <div className="card bg-base-100 shadow-md text-left mb-8">
          <div className="card-body">
            <h3 className="font-semibold mb-2">Order Total</h3>
            <p className="text-2xl font-bold text-primary mb-4">
              ₹{Number(orderPlaced.total).toFixed(2)}
            </p>
            <div className="flex gap-3">
              <button onClick={downloadInvoice} className="btn btn-primary btn-sm flex-1">
                <DownloadIcon className="size-4 mr-1" />
                Download Invoice
              </button>
              <button onClick={() => window.print()} className="btn btn-ghost btn-sm flex-1">
                <PrinterIcon className="size-4 mr-1" />
                Print
              </button>
            </div>
          </div>
        </div>

        <Link to="/" className="btn btn-primary">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Store
        </Link>
        <Link
          to={`/track?orderId=${orderPlaced.id}&email=${encodeURIComponent(orderPlaced.email)}`}
          className="btn btn-ghost ml-2"
        >
          <PackageSearchIcon className="size-4 mr-2" />
          Track Order
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">
          Go Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SHIPPING + PAYMENT FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Shipping Information</h2>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={form.customerName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">City</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="New York"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">ZIP Code</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={form.zipCode}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Payment Method</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => {
                        setPaymentMethod(method.id);
                        setUpiConfirmed(false);
                      }}
                      className={`border-2 rounded-xl p-4 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-base-300 hover:border-primary/40"
                      }`}
                    >
                      <Icon
                        className={`size-6 mb-2 ${active ? "text-primary" : "text-base-content/50"}`}
                      />
                      <p className="font-semibold text-sm">{method.label}</p>
                      <p className="text-xs text-base-content/50">{method.description}</p>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "UPI QR Code" && (
                  <div className="flex flex-col items-center py-4 border-t border-base-content/10">
                    <div className="bg-white p-4 rounded-lg shadow-inner flex flex-col items-center justify-center text-center">
                      <QRCodeSVG value="Thank you for shopping! Visit again." size={180} />
                    </div>
                    <p className="text-sm font-medium mt-3">Attach scanner there</p>
                    <p className="text-xs text-base-content/50 mb-4 text-center">
                      and after scanning, thank you for shopping, visit again!
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer bg-base-200 px-4 py-2.5 rounded-lg w-full justify-center">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={upiConfirmed}
                        onChange={(e) => setUpiConfirmed(e.target.checked)}
                      />
                      <span className="text-sm">I&apos;ve completed the payment</span>
                    </label>
                  </div>
                )}

              {paymentMethod === "Razorpay (Online)" && (
                <p className="text-xs text-base-content/50 flex items-center gap-1">
                  <ShieldCheckIcon className="size-4" />
                  You&apos;ll be redirected to Razorpay&apos;s secure checkout to complete payment.
                </p>
              )}
              {paymentMethod === "Cash on Delivery" && (
                <p className="text-sm text-base-content/60">
                  You&apos;ll pay in cash when your order is delivered. No advance payment needed.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (paymentMethod === "UPI QR Code" && !upiConfirmed)}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : paymentMethod === "Razorpay (Online)" ? (
              `Pay ₹${total.toFixed(2)}`
            ) : paymentMethod === "UPI QR Code" ? (
              <>
                <CheckIcon className="size-4 mr-1" />
                Confirm Order · ₹{total.toFixed(2)}
              </>
            ) : (
              `Place Order · ₹${total.toFixed(2)}`
            )}
          </button>
          <p className="text-xs text-center text-base-content/40">
            {paymentMethod === "Razorpay (Online)"
              ? "Test mode — use Razorpay's test card 4111 1111 1111 1111 to try it out."
              : paymentMethod === "UPI QR Code"
              ? "Payments aren't auto-verified — check your UPI app to confirm you've received it."
              : "This is a demo checkout."}
          </p>
        </form>

        {/* ORDER SUMMARY */}
        <div className="card bg-base-100 shadow-lg h-fit">
          <div className="card-body">
            <h2 className="card-title mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={handleImageError}
                      className="size-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-base-content/50">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider my-0" />
            <div className="space-y-2 text-sm mt-2">
              <div className="flex justify-between">
                <span className="text-base-content/60">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Estimated Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="divider my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default CheckoutPage;
