import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // adjust if using different router

const SimilarProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/v1/product/similar/${productId}`,
        );
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.log("Failed to fetch similar products:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchSimilar();
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          You may also like
        </h2>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[180px] h-56 rounded-xl bg-secondary/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        You may also like
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="min-w-[180px] cursor-pointer rounded-xl glass-card transition-transform hover:scale-[1.02]"
          >
            <div className="h-32 w-full overflow-hidden rounded-t-lg bg-secondary">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {product.category}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-semibold text-foreground">
                  ₹{Math.round(parseFloat(product.price) * 87)}
                </span>
                {parseFloat(product.ratings) > 0 && (
                  <span className="text-xs text-yellow-500 flex items-center gap-0.5">
                    ★ {parseFloat(product.ratings).toFixed(1)}
                  </span>
                )}
              </div>
              {product.stock === 0 && (
                <span className="text-[10px] text-destructive mt-1 block">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
