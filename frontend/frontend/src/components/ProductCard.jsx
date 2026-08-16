import { Link } from "react-router-dom";
import { EditIcon, ShoppingCartIcon, StarIcon } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAdminStore } from "../store/useAdminStore";
import { handleImageError } from "../lib/imageFallback";

function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const isOutOfStock = Number(product.stock) <= 0;
  const isLowStock = !isOutOfStock && Number(product.stock) <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative overflow-hidden bg-base-200 aspect-square mb-4">
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* STOCK LABEL */}
          {isOutOfStock ? (
            <span className="absolute top-3 left-3 bg-base-100 text-xs px-2 py-1 tracking-wide uppercase text-error">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="absolute top-3 left-3 bg-base-100 text-xs px-2 py-1 tracking-wide uppercase text-warning">
              {product.stock} left
            </span>
          ) : null}

          {/* QUICK ADD */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="absolute bottom-0 left-0 right-0 bg-neutral text-neutral-content text-sm py-3 tracking-wide
              translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 disabled:bg-base-300 disabled:text-base-content/40"
          >
            <ShoppingCartIcon className="size-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </Link>

      <p className="text-[11px] uppercase tracking-widest text-base-content/40 mb-1">
        {product.category || "General"}
      </p>

      <Link to={`/product/${product.id}`} className="hover:opacity-70 transition-opacity">
        <h2 className="text-sm font-medium line-clamp-1 mb-1">{product.name}</h2>
      </Link>

      <div className="flex items-center justify-between">
        <p className="font-serif text-lg">₹{Number(product.price).toFixed(2)}</p>

        <div className="flex items-center gap-1">
          <StarIcon className="size-3.5 fill-secondary text-secondary" />
          <span className="text-xs text-base-content/50">
            {Number(product.rating || 0).toFixed(1)}
          </span>
          <Link to={`/product/${product.id}`} className="ml-2 text-base-content/30 hover:text-base-content">
            {isAdmin && <EditIcon className="size-3.5" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
