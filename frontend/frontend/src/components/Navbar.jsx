import { Link } from "react-router-dom";
import { ShoppingBagIcon, PackageSearchIcon, LockIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useCartStore } from "../store/useCartStore";
import { useAdminStore } from "../store/useAdminStore";

function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const { isAdmin, logout } = useAdminStore();

  return (
    <div className="bg-base-100 border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4.5rem] justify-between">
          {/* LOGO */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              <span className="font-serif text-2xl tracking-tight">Shop Mate</span>
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2">
            <Link
              to="/track"
              className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-2 hover:opacity-70 transition-opacity"
            >
              <PackageSearchIcon className="size-4" strokeWidth={1.5} />
              Track Order
            </Link>

            <ThemeSelector />

            {/* subtle admin entry point - only meaningful to the store owner */}
            {isAdmin ? (
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-base-200 transition-colors"
                title="Log out of admin"
              >
                <LogOutIcon className="size-4 text-primary" strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                to="/admin/orders"
                className="p-2 rounded-full hover:bg-base-200 transition-colors opacity-30 hover:opacity-70"
                title="Store admin"
              >
                <LockIcon className="size-4" strokeWidth={1.5} />
              </Link>
            )}

            <Link to="/cart" className="indicator" aria-label="View cart">
              <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                <ShoppingBagIcon className="size-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="badge badge-sm badge-neutral indicator-item">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
