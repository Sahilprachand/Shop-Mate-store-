import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCwIcon, LockIcon, LogOutIcon } from "lucide-react";
import { BASE_URL } from "../store/useProductStore";
import { useAdminStore } from "../store/useAdminStore";
import { ORDER_STATUS_STEPS } from "../constants";

const ALL_STATUSES = [...ORDER_STATUS_STEPS, "Cancelled"];

function OrdersAdminPage() {
  const { isAdmin, login, logout, authHeader } = useAdminStore();

  const [passwordInput, setPasswordInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/orders`, { headers: authHeader() });
      setOrders(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired, please log in again");
        logout();
      } else {
        toast.error("Could not load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(passwordInput);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Incorrect password");
      } else {
        toast.error(
          error.response?.data?.message || "Could not reach the server. Is the backend running?"
        );
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${BASE_URL}/api/orders/${id}/status`, { status }, { headers: authHeader() });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success(`Order #${id} updated to "${status}"`);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired, please log in again");
        logout();
      } else {
        toast.error("Could not update order status");
      }
    }
  };

  // LOGIN GATE
  if (!isAdmin) {
    return (
      <main className="max-w-sm mx-auto px-4 py-24">
        <div className="text-center mb-8">
          <LockIcon className="size-8 mx-auto mb-4 text-base-content/40" />
          <h1 className="font-serif text-2xl mb-2">Admin Access</h1>
          <p className="text-sm text-base-content/50">Enter the store admin password to continue.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            required
            autoFocus
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="input input-bordered w-full rounded-none"
          />
          <button type="submit" disabled={loginLoading} className="btn btn-neutral w-full rounded-none">
            {loginLoading ? <span className="loading loading-spinner loading-sm" /> : "Enter"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-base-content/50 mb-2">
            Store Admin
          </p>
          <h1 className="font-serif text-3xl">Orders</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={fetchOrders} className="btn btn-ghost btn-circle" title="Refresh">
            <RefreshCwIcon className="size-5" />
          </button>
          <button onClick={logout} className="btn btn-ghost btn-circle" title="Log out">
            <LogOutIcon className="size-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-base-content/50 py-20">No orders placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-xs uppercase tracking-wide">
                <th>Order</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Placed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">#{order.id}</td>
                  <td>
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-base-content/50">{order.email}</p>
                  </td>
                  <td className="text-sm">{order.payment_method}</td>
                  <td>₹{Number(order.total).toFixed(2)}</td>
                  <td className="text-sm text-base-content/60">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      className="select select-bordered select-sm rounded-none"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
export default OrdersAdminPage;
