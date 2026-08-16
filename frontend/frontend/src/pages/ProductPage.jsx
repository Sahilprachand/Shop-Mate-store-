import { useNavigate, useParams, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useAdminStore } from "../store/useAdminStore";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, SaveIcon, ShoppingCartIcon, StarIcon, Trash2Icon } from "lucide-react";
import { CATEGORIES } from "../constants";
import GalleryImagesInput from "../components/GalleryImagesInput";
import { handleImageError } from "../lib/imageFallback";

function ProductPage() {
  const {
    currentProduct,
    products,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetchProduct(id);
    if (products.length === 0) fetchProducts();
  }, [fetchProduct, fetchProducts, id, products.length]);

  useEffect(() => {
    setActiveImage(currentProduct?.image || null);
  }, [currentProduct]);

  const gallery = currentProduct
    ? [currentProduct.image, ...(currentProduct.images || [])].filter(
        (url, i, arr) => url && arr.indexOf(url) === i
      )
    : [];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const isOutOfStock = currentProduct && Number(currentProduct.stock) <= 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE GALLERY */}
        <div>
          <div className="rounded-lg overflow-hidden shadow-lg bg-base-100 mb-4 aspect-square">
            <img
              src={activeImage || currentProduct?.image}
              alt={currentProduct?.name}
              onError={handleImageError}
              className="size-full object-cover"
            />
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 mb-4">
              {gallery.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`size-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                    activeImage === url ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`${currentProduct?.name} ${i + 1}`} onError={handleImageError} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* only admins see this button here; regular visitors add to cart from the panel on the right */}
          {isAdmin && (
            <button
              onClick={() => currentProduct && addToCart(currentProduct)}
              disabled={!currentProduct || isOutOfStock}
              className="btn btn-primary w-full"
            >
              <ShoppingCartIcon className="size-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>

        {/* RIGHT PANEL: public product info, or admin edit form */}
        {isAdmin ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Edit Product</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProduct(id);
                }}
                className="space-y-6"
              >
                {/* PRODUCT NAME */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">Product Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* PRODUCT PRICE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">Price</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                {/* CATEGORY + STOCK */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base font-medium">Category</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formData.category || "General"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base font-medium">Stock</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="input input-bordered w-full"
                      value={formData.stock ?? ""}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                {/* PRODUCT IMAGE URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">Image URL</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <GalleryImagesInput
                  images={formData.images || []}
                  onChange={(images) => setFormData({ ...formData, images })}
                />

                {/* FORM ACTIONS */}
                <div className="flex justify-between mt-8">
                  <button type="button" onClick={handleDelete} className="btn btn-error">
                    <Trash2Icon className="size-4 mr-2" />
                    Delete Product
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !formData.name || !formData.price || !formData.image}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-widest text-base-content/40 mb-2">
              {currentProduct?.category || "General"}
            </p>
            <h1 className="font-serif text-3xl mb-3">{currentProduct?.name}</h1>

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`size-4 ${
                    i < Math.round(currentProduct?.rating || 0)
                      ? "fill-secondary text-secondary"
                      : "text-base-content/20"
                  }`}
                />
              ))}
              <span className="text-xs text-base-content/50 ml-1">
                {Number(currentProduct?.rating || 0).toFixed(1)}
              </span>
            </div>

            <p className="font-serif text-3xl mb-6">
              ₹{Number(currentProduct?.price || 0).toFixed(2)}
            </p>

            {isOutOfStock ? (
              <p className="text-error text-sm mb-6">Currently out of stock</p>
            ) : Number(currentProduct?.stock) <= 5 ? (
              <p className="text-warning text-sm mb-6">Only {currentProduct?.stock} left</p>
            ) : (
              <p className="text-success text-sm mb-6">In stock</p>
            )}

            <button
              onClick={() => currentProduct && addToCart(currentProduct)}
              disabled={!currentProduct || isOutOfStock}
              className="btn btn-neutral rounded-none"
            >
              <ShoppingCartIcon className="size-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {currentProduct &&
        (() => {
          const related = products
            .filter(
              (p) => p.id !== currentProduct.id && p.category === currentProduct.category
            )
            .slice(0, 4);

          if (related.length === 0) return null;

          return (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">You might also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <figure className="p-3 pb-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={handleImageError}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </figure>
                    <div className="card-body p-3">
                      <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                      <p className="text-primary font-bold">₹{Number(p.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
export default ProductPage;
