import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { useAdminStore } from "../store/useAdminStore";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import AddProductModal from "../components/AddProductModal";
import { CATEGORIES, SORT_OPTIONS } from "../constants";

function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();
  const isAdmin = useAdminStore((state) => state.isAdmin);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visibleProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (category !== "All") {
      result = result.filter((p) => (p.category || "General") === category);
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating_desc":
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [products, search, category, sortBy]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* HERO — minimal editorial layout */}
      <div className="relative overflow-hidden rounded-2xl bg-base-200 mb-12 grid grid-cols-1 md:grid-cols-2 min-h-[460px] border border-base-content/5">
        {/* LEFT: copy */}
        <div className="flex flex-col justify-center p-10 md:p-16 relative z-10">
          <p className="uppercase tracking-[0.2em] text-xs text-base-content/50 mb-5">
            New Season
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-medium mb-6 leading-[1.1] tracking-tight">
            Considered
            <br />
            essentials.
          </h1>
          <p className="text-base-content/60 max-w-sm mb-10 leading-relaxed">
            A carefully curated selection of electronics, fashion, and home goods —
            chosen for quality, not quantity.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-sm mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-11 bg-base-100 border-base-content/15 focus:border-primary rounded-lg"
            />
          </div>
        </div>

        {/* RIGHT: photography */}
        <div className="relative hidden md:block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80"
            alt="Curated shopping selection"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-10 pb-6 border-b border-base-content/10">
        {isAdmin ? (
          <button
            className="btn btn-outline btn-neutral rounded-none tracking-wide"
            onClick={() => document.getElementById("add_product_modal").showModal()}
          >
            <PlusCircleIcon className="size-4 mr-2" />
            Add Product
          </button>
        ) : (
          <div />
        )}

        <div className="flex gap-3 flex-wrap">
          <select
            className="select select-bordered rounded-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered rounded-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button className="btn btn-ghost btn-circle" onClick={fetchProducts} title="Refresh">
            <RefreshCwIcon className="size-5" />
          </button>
        </div>
      </div>

      {isAdmin && <AddProductModal />}

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              {products.length === 0
                ? "Get started by adding your first product to the inventory"
                : "Try a different search term or category"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
export default HomePage;
