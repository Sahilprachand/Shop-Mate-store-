import { Link, useNavigate } from "react-router-dom";
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { handleImageError } from "../lib/imageFallback";

function CartPage() {
  const { items, increment, decrement, removeFromCart, totalPrice } = useCartStore();
  const navigate = useNavigate();

  const subtotal = totalPrice();
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 49) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-base-100 rounded-full p-6 w-fit mx-auto mb-6">
          <ShoppingBagIcon className="size-12 text-base-content/40" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-base-content/60 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeftIcon className="size-4 mr-2" />
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ITEMS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card card-side bg-base-100 shadow-md">
              <figure className="w-28 h-28 shrink-0 p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover rounded-lg"
                />
              </figure>
              <div className="card-body py-4 flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-primary font-bold">₹{item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="join">
                    <button
                      className="btn btn-sm join-item"
                      onClick={() => decrement(item.id)}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="size-3" />
                    </button>
                    <span className="btn btn-sm join-item pointer-events-none">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm join-item"
                      onClick={() => increment(item.id)}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="size-3" />
                    </button>
                  </div>

                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="card bg-base-100 shadow-lg h-fit">
          <div className="card-body">
            <h2 className="card-title mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
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

            {subtotal < 1000 && (
              <p className="text-xs text-base-content/50 mt-2">
                Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}

            <button onClick={() => navigate("/checkout")} className="btn btn-primary w-full mt-6">
              Proceed to Checkout
            </button>
            <Link to="/" className="btn btn-ghost w-full mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
export default CartPage;
