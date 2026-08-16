import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { SearchIcon, PackageSearchIcon } from "lucide-react";
import { BASE_URL } from "../store/useProductStore";
import OrderStatusStepper from "../components/OrderStatusStepper";

function TrackOrderPage() {
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/orders/track/${orderId}?email=${encodeURIComponent(email)}`
      );
      setOrder(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || "Could not find that order";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="uppercase tracking-[0.2em] text-xs text-base-content/50 mb-3">
          Order Status
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mb-3">Track Your Order</h1>
        <p className="text-base-content/60 text-sm">
          Enter your Order ID and the email you used at checkout.
        </p>
      </div>

      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          required
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="input input-bordered flex-1 rounded-none"
        />
        <input
          type="email"
          required
          placeholder="Email used at checkout"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered flex-1 rounded-none"
        />
        <button type="submit" disabled={loading} className="btn btn-neutral rounded-none">
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <>
              <SearchIcon className="size-4 mr-1" />
              Track
            </>
          )}
        </button>
      </form>

      {error && !loading && (
        <div className="text-center py-12 text-base-content/50">
          <PackageSearchIcon className="size-10 mx-auto mb-3 opacity-40" />
          <p>{error}</p>
        </div>
      )}

      {order && (
        <div className="border border-base-content/10 p-6 md:p-8">
          <div className="flex justify-between items-start mb-8 flex-wrap gap-2">
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide">Order</p>
              <p className="font-serif text-xl">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-base-content/50 uppercase tracking-wide">Placed on</p>
              <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-10">
            <OrderStatusStepper status={order.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">
                Shipping To
              </p>
              <p>{order.customer_name}</p>
              <p className="text-base-content/60">
                {order.address}, {order.city} {order.zip_code}
              </p>
            </div>
            <div>
              <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">
                Payment Method
              </p>
              <p>{order.payment_method}</p>
            </div>
          </div>

          <div className="divider my-0" />

          <div className="space-y-3 py-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product_name} <span className="text-base-content/40">× {item.quantity}</span>
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="divider my-0" />

          <div className="flex justify-between font-serif text-lg pt-6">
            <span>Total</span>
            <span>₹{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}
    </main>
  );
}
export default TrackOrderPage;
